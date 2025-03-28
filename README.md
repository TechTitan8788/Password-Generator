<!-- import { useState, useCallback, useEffect, useRef } from 'react'

function App() {
  // State hooks for password configuration
  const [length, setLength] = useState(12)        // Password length (default: 12)
  const [numberAllowed, setNumberAllowed] = useState(true)  // Include numbers toggle
  const [charAllowed, setCharAllowed] = useState(true)      // Include special chars toggle
  const [password, setPassword] = useState("")    // Generated password storage
  const [copied, setCopied] = useState(false)     // Copy button feedback state

  // useRef hook to access the password input DOM element
  const passwordRef = useRef(null)

  /**
   * Generates a random password based on current settings
   * Uses useCallback to memoize the function and prevent unnecessary recreations
   */
  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" // Base characters
    
    // Add numbers if allowed
    if (numberAllowed) str += "0123456789"
    // Add special characters if allowed
    if (charAllowed) str += "!@#$%^&*-_+=[]{}~`"

    // Build the password character by character
    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length)
      pass += str.charAt(char)
    }

    setPassword(pass) // Update the password state
  }, [length, numberAllowed, charAllowed, setPassword]) // Dependencies for memoization

  /**
   * Copies the generated password to clipboard
   * Uses useCallback for performance optimization
   */
  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select() // Select the password text
    window.navigator.clipboard.writeText(password) // Copy to clipboard
    setCopied(true) // Show feedback
    setTimeout(() => setCopied(false), 2000) // Hide feedback after 2 seconds
  }, [password])

  // useEffect hook to generate password when dependencies change
  useEffect(() => {
    passwordGenerator()
  }, [length, numberAllowed, charAllowed, passwordGenerator])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      {/* Main container */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-white mb-4">
          Password Generator
        </h1>
        
        {/* Password display with copy button */}
        <div className="flex mb-6 rounded overflow-hidden">
          <input
            type="text"
            value={password}
            className="flex-1 px-4 py-2 bg-gray-700 text-white outline-none"
            placeholder="Password will appear here"
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className={`px-4 py-2 font-medium text-white ${
              copied ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Controls section */}
        <div className="space-y-4">
          {/* Length slider */}
          <div>
            <div className="flex justify-between text-gray-300 mb-2">
              <label>Length: {length}</label>
            </div>
            <input
              type="range"
              min="6"
              max="32"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Checkboxes for character options */}
          <div className="flex gap-4 text-gray-300">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={numberAllowed}
                onChange={() => setNumberAllowed(prev => !prev)}
                className="w-4 h-4"
              />
              Include Numbers
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={charAllowed}
                onChange={() => setCharAllowed(prev => !prev)}
                className="w-4 h-4"
              />
              Include Special Characters
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App -->