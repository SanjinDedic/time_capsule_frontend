import React, { useState } from 'react';
import { toast } from 'react-toastify';

// Get API URL from environment variables - Vite exposes these with the VITE_ prefix
const API_URL = import.meta.env.VITE_API_URL || "http://52.62.194.208:8000";

function TimeCapsule() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState({
    message: "",
    messageContent: "",
    timeCreated: "",
    timeRevealed: "",
    lockedBy: "",
    encryptionMethod: "",
    userKey: "",
  });

  // Function to convert Unix timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard!", {
          position: "top-center",
          autoClose: 2000,
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy to clipboard", {
          position: "top-center",
        });
      });
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      toast.error("Please enter your time capsule data", {
        position: "top-center",
      });
      return;
    }

    try {
      const res = await fetch(`/api/proxy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: userInput }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit - server responded with an error");
      }

      const data = await res.json();

      setResponse({
        message: data.message || "",
        messageContent: data.messageContent || "",
        timeCreated: data.time_created || "",
        timeRevealed: data.time_revealed || "",
        lockedBy: data.locked_by || "",
        encryptionMethod: data.encryption_method || "",
        userKey: data.user_key || "",
      });

      toast.success("Time capsule submitted successfully!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Failed to submit: ${error.message}`, {
        position: "top-center",
      });
    }
  };

  const capsuleText =
    "bWVzc2FnZTogRlRDIEZaVFggWlJGIFJKIEVHWVJCWFAgWFdCIFVKS0FJIDIgTFEgVEYgVklIIEdPWSBVUUxNQyBVUUJPTiBIWEtaSUZLQVcgV0tFIEpBWkNIQlFMIFJMS09BSlRQIElCQ1RVWFZMSCBaVEtMRFMgQk9KUiBQWUxBSUhTTUJDIChCTiBTVEJXIFZPTUhCRE1STUpPIEpVRlQgUkNUIFBYWEZURSBHTiBNUVRPKSwgdGltZV9jcmVhdGVkOiAxNzQ0NTk5MDI0LCB0aW1lX3JldmVhbGVkOiAxODMwOTk5MDI0LCBsb2NrZWRfYnk6IFNhbmppbiwgZW5jcnlwdGlvbl9tZXRob2Q6IHZpZ2VuZXJlLCB1c2VyX2tleTogTVlWRVJZUFVCTElDS0VZ";

  return (
    <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-8 mx-auto my-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Time Capsule Decrypter
      </h1>

      <div className="space-y-6">
        {/* Encrypted container with improved wrapping and copy button */}
        <div className="bg-indigo-900 text-white p-6 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-indigo-200 font-medium">
              Encrypted Capsule
            </span>
            <button
              onClick={() => copyToClipboard(capsuleText)}
              className="px-3 py-1 bg-indigo-700 hover:bg-indigo-600 rounded text-xs font-medium flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </button>
          </div>
          <div className="bg-indigo-800 border border-indigo-600 p-4 rounded-md font-mono text-sm overflow-auto">
            <div className="whitespace-pre-wrap break-words">{capsuleText}</div>
          </div>
        </div>

        <div className="text-gray-700 space-y-4">
          <p>
            The VCC creators have found a way publish secret messages that
            become revealed at a set future date. They are proud of their
            unhackable invention and have even published the source code:
          </p>

          <div className="space-y-2 border-l-2 border-green-500 pl-4">
            <p className="font-medium">
              Trinket.io:
              <span className="ml-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                Recommended
              </span>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Python Capsule Maker:{" "}
                <a
                  href="https://trinket.io/library/trinkets/cb0c43fc99"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 italic"
                >
                  Capsule Creator
                </a>
              </li>
              <li>
                Python Cloud Based Decryptor (with documentation):{" "}
                <a
                  href="https://trinket.io/library/trinkets/b2e45be806"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 italic"
                >
                  Capsule Decoder
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2 border-l-2 border-gray-300 pl-4">
            <p className="font-medium">
              GitHub:
              <span className="ml-2 inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">
                Optional for advanced users
              </span>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Time Capsule Server Code:{" "}
                <a
                  href="https://github.com/SanjinDedic/time_capsule"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 italic"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                Frontend Code (not relevant to the problem):{" "}
                <a
                  href="https://github.com/SanjinDedic/time_capsule_frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 italic"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

          <p>
            Your task is to analyse the code above, find weaknesses and crack
            the time capsule before 9/01/2028 (when the time capsule is set to
            be revealed).
          </p>
          <p>
            A good place to start is by running the capsule_maker code on
            trinket.io or your own computer and seeing how the encryption works.
          </p>

          <div className="space-y-2">
            <p className="font-medium">Optional reading:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <a
                  href="https://docs.python.org/3/library/base64.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Base64 Library
                </a>
              </li>
              <li>
                <a
                  href="https://requests.readthedocs.io/en/latest/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Requests Library
                </a>
              </li>
              <li>
                <a
                  href="https://fastapi.tiangolo.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  FastAPI Library
                </a>
              </li>
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
              <span className="font-medium w-36 text-gray-700">
                Time Created:
              </span>
              <div>
                <span className="text-gray-800">{response.timeCreated}</span>
                {response.timeCreated && (
                  <span className="ml-2 text-green-600">
                    ({formatDate(response.timeCreated)})
                  </span>
                )}
              </div>
            </div>

            <div className="flex">
              <span className="font-medium w-36 text-gray-700">
                Time Revealed:
              </span>
              <div>
                <span className="text-gray-800">{response.timeRevealed}</span>
                {response.timeRevealed && (
                  <span className="ml-2 text-green-600">
                    ({formatDate(response.timeRevealed)})
                  </span>
                )}
              </div>
            </div>

            <div className="flex">
              <span className="font-medium w-36 text-gray-700">Locked By:</span>
              <span className="text-gray-800">{response.lockedBy}</span>
            </div>

            <div className="flex">
              <span className="font-medium w-36 text-gray-700">
                Encryption Method:
              </span>
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