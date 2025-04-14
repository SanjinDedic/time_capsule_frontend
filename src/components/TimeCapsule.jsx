import React, { useState } from 'react';
import { toast } from 'react-toastify';

// Get API URL from environment variables - Vite exposes these with the VITE_ prefix
const API_URL = import.meta.env.VITE_API_URL;

function TimeCapsule() {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState({
    message: '',
    messageContent: '',
    timeCreated: '',
    timeRevealed: '',
    lockedBy: '',
    encryptionMethod: '',
    userKey: '',
  });

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      toast.error('Please enter your time capsule data', {
        position: "top-center"
      });
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/submit-capsule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: userInput })
      });

      if (!res.ok) {
        throw new Error('Failed to submit - server responded with an error');
      }

      const data = await res.json();
      
      setResponse({
        message: data.message || '',
        messageContent: data.messageContent || '',
        timeCreated: data.time_created || '',
        timeRevealed: data.time_revealed || '',
        lockedBy: data.locked_by || '',
        encryptionMethod: data.encryption_method || '',
        userKey: data.user_key || '',
      });
      
      toast.success('Time capsule submitted successfully!', {
        position: "top-center"
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed to submit: ${error.message}`, {
        position: "top-center"
      });
    }
  };

  return (
    <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-8 mx-auto my-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Time Capsule Decrypter</h1>
      
      <div className="space-y-6">
        {/* Encrypted container */}
        <div className="bg-indigo-900 text-white p-6 rounded-lg">
          <div className="bg-indigo-800 border border-indigo-600 p-4 rounded-md font-mono text-sm overflow-auto">
            bWVzc2FnZTogSGl0IGFtYWEgbHpxeWUgZ3Mgc3RxIDIwMjQgSmpyaGFqdnNmIE9hZGFhZiBPdG9tYXN6eXIgb2F4eCBidyBjcWFzZmJiYXVmdCBzbWZhbmd6bmdlIG9odGJmay4sIHRpbWVfY3JlYXRlZDogMTcxMjAzNTcwNywgdGltZV9yZXZlYWxlZDogMTcyMDY3NTcwNywgbG9ja2VkX2J5OiBTYW5qaW4sIGVuY3J5cHRpb25fbWV0aG9kOiB2aWdlbmVyZSwgdXNlcl9rZXk6IE9wM25TM3NAbTM=
          </div>
        </div>

        <div className="text-gray-700 space-y-4">
          <p>The VCC creators have found a way publish secret messages that become revealed at a set future date. They are proud of their unhackable invention and have even published the source code:</p>
          
          <div className="space-y-2">
            <p className="font-medium">Replit:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Python Capsule Maker: <span className="italic text-gray-600">https://replit.com/@SanjinDedic/capsulecreator</span></li>
              <li>Python Cloud Based Decryptor (with documentation): <span className="italic text-gray-600">https://replit.com/@SanjinDedic/capsuledecoder</span></li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">GitHub:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Python Capsule Maker: <a href="https://github.com/SanjinDedic/vcc/blob/main/2024_STAGE_1/capsule_creator.py" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 italic">capsule_creator.py</a></li>
              <li>Python Cloud Based Decryptor: <a href="https://github.com/SanjinDedic/vcc/blob/main/2024_STAGE_1/capsule_decoder.py" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 italic">capsule_decoder.py</a></li>
              <li>Decryptor Documentation: <a href="https://github.com/SanjinDedic/vcc/blob/main/2024_STAGE_1/DECODER_README.md" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 italic">DECODER README</a></li>
            </ul>
          </div>
          
          <p>Your task is to analyse the code above, find weaknesses and crack the time capsule before 11/07/2024 when its contents automatically reveal.</p>
          <p>A good place to start is by running the decryptor on Replit or on your own Python IDE. Also, it is possible to solve this both with and without writing code (key is reading code) Good luck!</p>
          
          <div className="space-y-2">
            <p className="font-medium">Optional reading:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><a href="https://docs.python.org/3/library/base64.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Base64 Library</a></li>
              <li><a href="https://requests.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Requests Library</a></li>
              <li><a href="https://fastapi.tiangolo.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">FastAPI Library</a></li>
            </ul>
          </div>
        </div>
        
        <textarea
          id="userInput"
          placeholder="Enter your time capsule here"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full h-32 p-3 border border-gray-300 rounded-md font-sans text-gray-700 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        ></textarea>
        
        <button 
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors mx-auto block"
        >
          Submit
        </button>
        
        {/* Response section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-md text-left">
          <div className="space-y-2">
            <div className="flex">
              <span className="font-medium w-36 text-gray-700">Message:</span>
              <span className="text-gray-800">{response.message}</span>
            </div>
            
            {response.messageContent && (
              <pre className="bg-gray-100 p-3 rounded-md font-mono text-sm mt-2 overflow-auto">
                {response.messageContent}
              </pre>
            )}
            
            <div className="flex">
              <span className="font-medium w-36 text-gray-700">Time Created:</span>
              <span className="text-gray-800">{response.timeCreated}</span>
            </div>
            
            <div className="flex">
              <span className="font-medium w-36 text-gray-700">Time Revealed:</span>
              <span className="text-gray-800">{response.timeRevealed}</span>
            </div>
            
            <div className="flex">
              <span className="font-medium w-36 text-gray-700">Locked By:</span>
              <span className="text-gray-800">{response.lockedBy}</span>
            </div>
            
            <div className="flex">
              <span className="font-medium w-36 text-gray-700">Encryption Method:</span>
              <span className="text-gray-800">{response.encryptionMethod}</span>
            </div>
            
            <div className="flex">
              <span className="font-medium w-36 text-gray-700">User Key:</span>
              <span className="text-gray-800">{response.userKey}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeCapsule;