"use client";
import { useState } from 'react';
import { Settings as SettingsIcon, Sliders } from 'lucide-react';

export default function Settings() {
  const [signSpeed, setSignSpeed] = useState(50);
  const [language, setLanguage] = useState('default');
  const [notifications, setNotifications] = useState(true);

  const saveSettings = () => {
    // In a real app, you'd save to local storage or backend
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-custom">
        <h1 className="text-3xl font-bold mb-6 text-center text-secondary-dark flex items-center justify-center">
          <SettingsIcon className="mr-3" /> Application Settings
        </h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">
              Sign Language Translation Speed
            </label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={signSpeed}
                onChange={(e) => setSignSpeed(Number(e.target.value))}
                className="w-full h-2 bg-primary-light rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-4 text-gray-600">{signSpeed}%</span>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">
              Sign Language Dialect
            </label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="default">Cameroonian Sign Language (CSL)</option>
              <option value="asl">American Sign Language (ASL)</option>
              <option value="bsl">British Sign Language (BSL)</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-gray-700">
              Enable Notifications
            </label>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-16 h-8 rounded-full transition-colors ${
                notifications ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <div 
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                  notifications ? 'translate-x-8' : 'translate-x-1'
                }`} 
              />
            </button>
          </div>
          
          <button 
            onClick={saveSettings}
            className="flex items-center justify-center w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            <Sliders className="mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}