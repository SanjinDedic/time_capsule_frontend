import React, { useState } from 'react';
import { toast } from 'react-toastify';

// Get API URL from environment variables - Vite exposes these with the VITE_ prefix
const API_URL = import.meta.env.VITE_API_URL || "http://52.62.194.208:8000";

function TimeCapsule() {
  const [userInput, setUserInput] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [response, setResponse] = useState({
    message: "",
    messageContent: "",
    timeCreated: "",
    timeRevealed: "",
    lockedBy: "",
    encryptionMethod: "",
    userKey: "",
  });

  // Function to convert timestamp to readable date in Australian Eastern Time
  // Handles both Unix timestamps and formatted date strings
  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    let date;
    let epochSeconds = "";

    // Check if the timestamp is a string in the format "DD/MM/YYYY HH:MM:SS AM/PM UTC"
    if (typeof timestamp === "string" && timestamp.includes("/")) {
      // Parse the formatted date string
      // Expected format: "14/04/2025 02:50:24 AM UTC"
      const [datePart, timePart] = timestamp.split(" ");
      const [day, month, year] = datePart.split("/");

      // Extract time components
      let [time, ampm, timezone] = timePart.split(" ");
      if (!timezone && ampm && ampm.includes("UTC")) {
        timezone = ampm;
        ampm = "";
      }

      const [hours, minutes, seconds] = time.split(":");

      // Convert hours to 24-hour format if PM
      let hour24 = parseInt(hours);
      if (ampm === "PM" && hour24 < 12) hour24 += 12;
      if (ampm === "AM" && hour24 === 12) hour24 = 0;

      // Create a Date object in UTC
      date = new Date(
        Date.UTC(
          parseInt(year),
          parseInt(month) - 1, // JavaScript months are 0-indexed
          parseInt(day),
          hour24,
          parseInt(minutes),
          parseInt(seconds)
        )
      );

      // Calculate epoch seconds
      epochSeconds = Math.floor(date.getTime() / 1000);
    } else {
      // Handle it as a Unix timestamp (seconds since epoch)
      epochSeconds = timestamp;
      date = new Date(timestamp * 1000);
    }

    const formattedDate = date.toLocaleString("en-AU", {
      timeZone: "Australia/Sydney",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return { epochSeconds, formattedDate };
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
      console.log("Server response:", data); // For debugging

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

  // Single capsule text variable for the entire component
  const capsuleText =
    "bWVzc2FnZTogRlRDIEZaVFggWlJGIFJKIEVHWVJCWFAgWFdCIFVKS0FJIDIgTFEgVEYgVklIIEdPWSBVUUxNQyBVUUJPTiBIWEtaSUZLQVcgV0tFIEpBWkNIQlFMIFJMS09BSlRQIElCQ1RVWFZMSCBaVEtMRFMgQk9KUiBQWUxBSUhTTUJDIChCTiBTVEJXIFZPTUhCRE1STUpPIEpVRlQgUkNUIFBYWEZURSBHTiBNUVRPKSwgdGltZV9jcmVhdGVkOiAxNzQ0NTk5MDI0LCB0aW1lX3JldmVhbGVkOiAxODMwOTk5MDI0LCBsb2NrZWRfYnk6IFNhbmppbiwgZW5jcnlwdGlvbl9tZXRob2Q6IHZpZ2VuZXJlLCB1c2VyX2tleTogTVlWRVJZUFVCTElDS0VZ";

  return (
    <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-8 mx-auto my-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Time Capsule Decrypter
      </h1>

      <div className="space-y-6">
        {/* Problem Info Dropdown */}
        <div className="w-full mb-6">
          {/* Dropdown Header */}
          <button
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className="w-full flex justify-between items-center p-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            <span className="font-semibold text-lg">
              VCC Time Capsule Problem Info
            </span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                isInfoOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Content */}
          {isInfoOpen && (
            <div className="p-4 border-x border-b rounded-b-lg bg-white shadow-lg text-gray-800 animate-fadeIn">
              <div className="space-y-4">
                {/* VCC Team Encrypted Capsule */}
                <div className="bg-[#4338ca] text-white p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-indigo-200 font-medium">
                      Encrypted Capsule containing the secret message from the
                      VCC team:
                    </span>
                    <button
                      onClick={() => copyToClipboard(capsuleText)}
                      className="px-2 py-1 bg-indigo-700 hover:bg-indigo-600 rounded text-xs font-medium flex items-center"
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
                    <div className="whitespace-pre-wrap break-words">
                      {capsuleText}
                    </div>
                  </div>
                </div>

                <p>
                  The VCC creators have found a way publish secret messages that
                  become revealed at a set future date. They are proud of their
                  unhackable invention and have even published the source code:
                </p>

                <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r-lg">
                  <p className="font-medium flex items-center">
                    Trinket.io:
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                      Recommended
                    </span>
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>
                      Python Capsule Maker:{" "}
                      <a
                        href="https://trinket.io/library/trinkets/cb0c43fc99"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 italic underline"
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
                        className="text-blue-600 hover:text-blue-800 italic underline"
                      >
                        Capsule Decoder
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-gray-300 pl-4 py-2 bg-gray-50 rounded-r-lg">
                  <p className="font-medium flex items-center">
                    GitHub:
                    <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      Optional for advanced users
                    </span>
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>
                      Time Capsule Server Code:{" "}
                      <a
                        href="https://github.com/SanjinDedic/time_capsule"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 italic underline"
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
                        className="text-blue-600 hover:text-blue-800 italic underline"
                      >
                        GitHub Repository
                      </a>
                    </li>
                  </ul>
                </div>

                <p>
                  Your task is to analyse the code above, find weaknesses and
                  crack the time capsule before 9/01/2028 (when the time capsule
                  is set to be revealed).
                </p>

                <p>
                  A good place to start is by running the capsule_maker code on
                  trinket.io or your own computer and seeing how the encryption
                  works.
                </p>

                <div className="mt-4">
                  <p className="font-medium">Optional reading:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>
                      <a
                        href="https://docs.python.org/3/library/base64.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Base64 Library
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://requests.readthedocs.io/en/latest/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Requests Library
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://fastapi.tiangolo.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        FastAPI Library
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Enter your time capsule and click submit
        </h2>

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
                {response.timeCreated &&
                  formatDate(response.timeCreated).epochSeconds}{" "}
                <span className="text-green-600 font-medium">
                  ({formatDate(response.timeCreated).formattedDate})
                </span>
              </div>
            </div>

            <div className="flex">
              <span className="font-medium w-36 text-gray-700">
                Time Revealed:
              </span>
              <div>
                {response.timeRevealed &&
                  formatDate(response.timeRevealed).epochSeconds}{" "}
                <span className="text-green-600 font-medium">
                  ({formatDate(response.timeRevealed).formattedDate})
                </span>
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