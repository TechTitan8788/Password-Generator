import { useState, useCallback, useEffect, useRef } from "react";

function App() {
  // ========== STATE MANAGEMENT WITH useState ==========
  /*
   * useState Hook:
   * - Creates state variables that trigger re-renders when updated
   */
  const [length, setLength] = useState(12); // Default password length
  const [numberAllowed, setNumberAllowed] = useState(true); // Include numbers
  const [charAllowed, setCharAllowed] = useState(true); // Include special chars
  const [password, setPassword] = useState(""); // Stores generated password
  const [copied, setCopied] = useState(false); // Copy status feedback
  const [strength, setStrength] = useState(""); // Password strength rating
  const [particles, setParticles] = useState([]); // Background animation data

  // ========== DOM ACCESS WITH useRef ==========
  /*
   * useRef Hook:
   * - Creates a mutable reference that persists across renders
   * - Doesn't trigger re-renders when value changes
   */
  const passwordRef = useRef(null);

  // ========== SIDE EFFECTS WITH useEffect ==========
  /*
   * useEffect Hook :
   * - Runs once when component mounts (empty dependency array)
   */
  useEffect(() => {
    const particlesArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      top: Math.random() * 100, // Random vertical position (0-100%)
      left: Math.random() * 100, // Random horizontal position (0-100%)
      size: Math.random() * 10 + 5, // Random size (5-15px)
      delay: Math.random() * 5, // Random animation delay (0-5s)
    }));
    setParticles(particlesArray);
  }, []); // Empty array = runs only on mount

  // ========== PASSWORD GENERATION ==========
  /*
   * useCallback Hook (Password Generator):
   * - Memoizes the password generation function
   * - Only recreates when dependencies change
   * - Prevents unnecessary re-renders of child components
   */
  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    // Add numbers if allowed
    if (numberAllowed) str += "0123456789";
    // Add special characters if allowed
    if (charAllowed) str += "!@#$%^&*-_+=[]{}~`";

    // Generate random password
    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }

    setPassword(pass);
    calculateStrength(pass);
  }, [length, numberAllowed, charAllowed, setPassword]);

  // Calculate password strength (helper function)
  const calculateStrength = (pass) => {
    let score = 0;

    // Length contributes up to 50 points
    score += Math.min(50, (pass.length / 20) * 50);

    // Check character variety
    const hasLower = /[a-z]/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);

    let varietyCount = 0;
    if (hasLower) varietyCount++;
    if (hasUpper) varietyCount++;
    if (hasNumber) varietyCount++;
    if (hasSpecial) varietyCount++;

    // Variety contributes up to 30 points
    score += (varietyCount / 4) * 30;

    // Unique characters contribute up to 20 points
    const uniqueChars = new Set(pass.split("")).size;
    score += Math.min(20, (uniqueChars / pass.length) * 20);

    // Set strength level based on score
    if (score < 40) {
      setStrength("Weak");
    } else if (score < 70) {
      setStrength("Medium");
    } else {
      setStrength("Strong");
    }
  };

  // ========== PASSWORD COPY FUNCTION ==========
  /*
   * useCallback Hook (Copy Password):
   * - Memoizes the copy function
   * - Only recreates when password changes
   * - Provides stable reference for click handler
   */
  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select(); // Select password text
    passwordRef.current?.setSelectionRange(0, 999); // Select all (mobile support)
    window.navigator.clipboard.writeText(password); // Copy to clipboard
    setCopied(true); // Show feedback
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  }, [password]);

  // ========== AUTO-GENERATE ON SETTINGS CHANGE ==========
  /*
   * useEffect Hook (Auto-Generate Password):
   * - Runs whenever generation settings change
   * - Calls passwordGenerator to create new password
   * - Dependency array ensures it only runs when needed
   */
  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  // ========== COMPONENT RENDER ==========
  return (
    <div className="relative w-full min-h-screen flex justify-center items-center p-5 bg-slate-900 overflow-hidden">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white bg-opacity-10 animate-float"
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-md bg-slate-800 bg-opacity-80 backdrop-blur-md rounded-xl p-8 shadow-xl border border-white border-opacity-10 animate-fade-in">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-500 to-blue-300 bg-clip-text text-transparent">
          Password Generator
        </h1>
        <p className="text-sm text-slate-400 text-center mb-6">
          Create strong, random passwords
        </p>

        {/* Password Display Area */}
        <div
          className={`flex mb-6 rounded-lg overflow-hidden transition-all duration-300 ${
            copied ? "ring-2 ring-emerald-500" : ""
          }`}
        >
          <input
            type="text"
            value={password}
            className="flex-1 px-4 py-3 bg-slate-900 bg-opacity-50 text-white outline-none"
            placeholder="Generating..."
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className={`px-4 font-medium transition-colors duration-300 ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {copied ? "✓" : "Copy"}
          </button>
        </div>

        {/* Strength Indicator */}
        <div className="flex items-center mb-6 text-sm">
          <span className="text-slate-400">Strength: </span>
          <span
            className={`ml-2 font-semibold ${
              strength === "Weak"
                ? "text-red-500"
                : strength === "Medium"
                ? "text-yellow-500"
                : strength === "Strong"
                ? "text-emerald-500"
                : ""
            }`}
          >
            {strength}
          </span>
        </div>

        {/* Controls Section */}
        <div className="space-y-5 mb-6">
          {/* Length Slider */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Length: {length}</span>
            </div>
            <input
              type="range"
              min="4"
              max="32"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Toggle Switches */}
          <div className="flex gap-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={numberAllowed}
                onChange={() => setNumberAllowed(!numberAllowed)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all"></div>
              <span className="ml-2 text-sm text-slate-400">Numbers</span>
            </label>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={charAllowed}
                onChange={() => setCharAllowed(!charAllowed)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all"></div>
              <span className="ml-2 text-sm text-slate-400">Special Chars</span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={passwordGenerator}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all"
        >
          Generate Password
        </button>
      </div>

      {/* Animation Styles */}
      <style jsx global>{`
        /* Floating animation for background particles */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-200px) translateX(100px);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float 15s infinite linear;
        }

        /* Fade-in animation for main card */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
