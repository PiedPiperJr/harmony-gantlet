"use client";
import { useState } from 'react';
import { Send, Volume2 } from 'lucide-react';

export default function TextToSign() {
  const [inputText, setInputText] = useState('');
  const [signedText, setSignedText] = useState('');

  const translateToSign = () => {
    if (!inputText.trim()) return;
    
    // Simulated sign language translation
    setSignedText(`Sign language representation of: "${inputText}"`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-custom">
        <h1 className="text-3xl font-bold mb-6 text-center text-secondary-dark">
          Text to Sign Translation
        </h1>
        
        <textarea 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to translate to sign language"
          className="w-full p-4 border border-gray-300 rounded-lg mb-4 min-h-[150px] focus:ring-2 focus:ring-primary"
        />
        
        <button 
          onClick={translateToSign}
          disabled={!inputText.trim()}
          className="flex items-center justify-center w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
        >
          <Volume2 className="mr-2" />
          Translate to Sign
        </button>
        
        <div className="mt-6 bg-gray-50 p-6 rounded-lg min-h-[100px] flex items-center justify-center">
          <p className="text-lg text-gray-800 text-center">
            {signedText || 'Sign language translation will appear here'}
          </p>
        </div>
      </div>
    </div>
  );
}