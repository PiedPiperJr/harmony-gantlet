'use client'

import { useState, useEffect } from 'react';
import { Bluetooth, StopCircle } from 'lucide-react';

// Types pour gérer les statuts de la connexion Bluetooth
type BluetoothConnectionStatus = 'disconnected' | 'pairing' | 'connected' | 'error';

// Type pour stocker les informations d'un appareil Bluetooth
type BluetoothDeviceInfo = {
  name: string;
  id: string;
};



export default function SignToText() {
  const [connectionStatus, setConnectionStatus] = useState<BluetoothConnectionStatus>('disconnected');
  const [translatedText, setTranslatedText] = useState<string>('Waiting for input...');
  const [device, setDevice] = useState<BluetoothDevice | null>(null); // eslint-disable-line no-console
  const [nearbyDevices, setNearbyDevices] = useState<BluetoothDeviceInfo[]>([]);
  const [animatedText, setAnimatedText] = useState<string>(''); // Nouvel état pour le texte animé.
  const wordToAnimate = "SignToText";

  // Fonction pour simuler l'apparition des lettres
  const animateText = async () => {
    setAnimatedText(''); // Réinitialise l'état avant de commencer.
    for (let i = 0; i <= wordToAnimate.length; i++) {
      setTimeout(() => {
        setAnimatedText(wordToAnimate.slice(0, i)); // Met à jour l'état avec la partie visible.
      }, i * 300); // Délai de 300ms entre chaque lettre.
    }
  };
  // Fonction pour découvrir les appareils Bluetooth à proximité
  const discoverDevices = async () => {
    try {
      if (!('bluetooth' in navigator)) {
        throw new Error("Web Bluetooth is not supported in this browser.");
      }
  
      setConnectionStatus('pairing');
  
      // Demander à l'utilisateur de choisir un appareil Bluetooth (accepter tous les appareils BLE)
      const selectedDevice = await navigator.bluetooth.requestDevice({ // eslint-disable-line no-console
        acceptAllDevices: true, // Accepter tous les appareils Bluetooth Low Energy
        optionalServices: [
              "0000ffe0-0000-1000-8000-00805f9b34fb",
              "0000180a-0000-1000-8000-00805f9b34fb",
              "00001801-0000-1000-8000-00805f9b34fb",
              "00001800-0000-1000-8000-00805f9b34fb"
        ]     // Liste d'UUID de services, vide ici si vous n'en avez pas besoin
      });
  
      console.log('Appareil trouvé :', selectedDevice.name || 'Nom inconnu');
      console.log('ID (Adresse ou identifiant interne) :', selectedDevice.id);
  
      // Connexion au serveur GATT de l'appareil
      const server = await selectedDevice.gatt?.connect();
      if (!server) {
        throw new Error("Failed to connect to GATT server.");
      }
  
      console.log('Connecté au serveur GATT :', server);
  
      // Récupérer les services disponibles sur l'appareil
      const services = await server.getPrimaryServices();
      console.log('Services disponibles :');
      services.forEach((service: { uuid: any; }) => {
        console.log(service.uuid); // Affiche l'UUID de chaque service
      });
  
      // Mettre à jour le statut de connexion et l'affichage du texte traduit
      setDevice(selectedDevice);
      setConnectionStatus('connected');
      setTranslatedText('Bluetooth device paired successfully.');
    } catch (error) {
      console.error('Erreurs :', error);
      setConnectionStatus('error');
      setTranslatedText(`Device discovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  async function connectToDevice(deviceId: any) {
    try {
      const response = await fetch('http://localhost:5000/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deviceId }),
      });
  
      const data = await response.json();
      console.log(data.message || data.error);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  }
  // connectToDevice('6B:93:F9:84:A9:A8');
  // Fonction pour appairer l'appareil Bluetooth sélectionné
  const pairDevice = async (deviceId: string) => {
    try {
      // Sélectionner l'appareil Bluetooth à appairer


      const selectedDevice = await navigator.bluetooth.requestDevice({ // eslint-disable-line no-console
        filters: [{ id: deviceId }]
      });

      // Se connecter à l'appareil et démarrer la traduction
      setDevice(selectedDevice);
      setConnectionStatus('connected');
      setTranslatedText('Bluetooth device paired successfully.');
    } catch (error) {
      setConnectionStatus('error');
      setTranslatedText(`Pairing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Fonction pour arrêter la traduction et la connexion Bluetooth
  const stopTranslation = () => {
    device?.gatt?.disconnect();
    setDevice(null);
    setConnectionStatus('disconnected');
    setTranslatedText('Translation stopped.');
  };

  // Vérifier si Web Bluetooth est pris en charge par le navigateur
  useEffect(() => {
    if (!('bluetooth' in navigator)) {
      setTranslatedText('Web Bluetooth not supported in this browser');
      setConnectionStatus('error');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-custom">
        <h1 className="text-3xl font-bold mb-6 text-center text-secondary-dark">
          Sign to Text Translation
        </h1>

        <div className="bg-gray-50 p-6 rounded-lg mb-6 min-h-[200px] flex items-center justify-center">
          {/* <p className="text-xl text-gray-800 text-center">{translatedText}</p> */}
          <p className="text-2xl text-blue-500 font-mono">{animatedText}</p>
        </div>
        <div className='flex flex-col w-full md:flex-row justify-around gap-2'>
        <div className="flex justify-center">
          <button
            onClick={animateText}
            className="flex w-[200px] justify-center items-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Start traducing
          </button>
        </div>
        {/* Affichage des appareils Bluetooth à proximité */}
        {nearbyDevices.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md">
            <h2 className="text-xl mb-4">Nearby Bluetooth Devices</h2>
            <ul>
              {nearbyDevices.map((device) => (
                <li key={device.id} className="flex justify-between items-center mb-3">
                  <span>{device.name}</span>
                  <button
                    onClick={() => pairDevice(device.id)}
                    className="flex justify-center p-4 w-[200px] bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                  >
                    Pair
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex justify-center w-full ">
            <button
              onClick={discoverDevices}
              className="flex w-[200px] justify-center items-center p-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              <Bluetooth className="mr-2" />
              Discover Devices
            </button>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <button
            onClick={stopTranslation}
            disabled={connectionStatus === 'disconnected'}
            className="flex w-[200px] justify-center items-center p-4 bg-accent text-white rounded-lg hover:bg-accent-dark transition"
          >
            <StopCircle className="mr-2" />
            Stop
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
