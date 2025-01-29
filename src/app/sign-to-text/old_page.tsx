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
  const [data, setData] = useState([]);
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

  useEffect(() => {
    fetch("/data.json") // Le fichier doit être dans `public/data.json`
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error("Erreur lors du chargement du JSON:", error));
  }, []);
  // Fonction pour découvrir les appareils Bluetooth à proximité
  
const discoverDevices = async () => {
    try {
        if (!('bluetooth' in navigator)) {
            throw new Error("Web Bluetooth is not supported in this browser.");
        }

        setConnectionStatus('pairing');

        // Demande de connexion à l'appareil Bluetooth
        const selectedDevice = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [
                "0000ffe0-0000-1000-8000-00805f9b34fb", // Service série BLE
                "0000180a-0000-1000-8000-00805f9b34fb",
                "00001801-0000-1000-8000-00805f9b34fb",
                "00001800-0000-1000-8000-00805f9b34fb"
            ]
        });

        console.log('Appareil trouvé :', selectedDevice.name || 'Nom inconnu');

        // Connexion au serveur GATT
        const server = await selectedDevice.gatt?.connect();
        if (!server) throw new Error("Failed to connect to GATT server.");

        console.log('Connecté au serveur GATT.');

        // Accès au service Bluetooth
        const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
        const characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');

        console.log('Service et caractéristique obtenus.');

        // ✅ 1. Lire une seule fois la valeur
        const value = await characteristic.readValue();
        const decodedValue = new TextDecoder().decode(value);
        console.log("Valeur lue immédiatement :", decodedValue);

        // ✅ 2. Activer les notifications pour recevoir des mises à jour
        await characteristic.startNotifications();

        characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
            const receivedValue = new TextDecoder().decode(event.target.value);
            console.log("Données reçues via notifications :", receivedValue);
        });

        console.log("Notifications activées.");

        // Mettre à jour l'état de connexion
        setDevice(selectedDevice);
        setConnectionStatus('connected');
        setTranslatedText('Bluetooth device paired successfully.');
    } catch (error) {
        console.error('Erreur :', error);
        setConnectionStatus('error');
        setTranslatedText(`Device discovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

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

  //Fonctions pour la prédiction des signes
  function compute_distance(v1:number[], v2:number[], size: number) {
    let d = 0;
    for (let i = 0; i < size; i++)
        d += Math.pow(v2[i] - v1[i], 2);
    return Math.sqrt(d)
}

function predict(v:number[], size:number){
    let min_l = "0", min = 1000;
    for (let letter in data) {
        const d = compute_distance(data[letter], v, size) 
        if (d<min ) {
            min = d
            min_l = letter
        }
    }
    return min_l
}
const e = [254.7837796242504, 263.7103910794274, 229.77819692503965, 242.32269216413385, 146.84837212268775]
predict(e,5)

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
