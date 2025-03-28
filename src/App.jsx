import { useState, useCallback, useEffect, useRef } from 'react'

function App() {
  const [length, setLength] = useState(12)
  const [numberAllowed, setNumberAllowed] = useState(true)
  const [charAllowed, setCharAllowed] = useState(true)
  const [password, setPassword] = useState("")
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState("")
  const [particles, setParticles] = useState([])

  const passwordRef = useRef(null)

  // Initialize particles
  useEffect(() => {
    const particlesArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 10 + 5,
      delay: Math.random() * 5
    }))
    setParticles(particlesArray)
  }, [])

  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if (numberAllowed) str += "0123456789"
    if (charAllowed) str += "!@#$%^&*-_+=[]{}~`"

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length)
      pass += str.charAt(char)
    }

    setPassword(pass)
    calculateStrength(pass)
  }, [length, numberAllowed, charAllowed, setPassword])

  const calculateStrength = (pass) => {
    let strengthScore = 0
    
    // Length contributes up to 50 points
    strengthScore += Math.min(50, (pass.length / 20) * 50)
    
    // Variety contributes up to 30 points
    const hasLower = /[a-z]/.test(pass)
    const hasUpper = /[A-Z]/.test(pass)
    const hasNumber = /[0-9]/.test(pass)
    const hasSpecial = /[^A-Za-z0-9]/.test(pass)
    
    let varietyCount = 0
    if (hasLower) varietyCount++
    if (hasUpper) varietyCount++
    if (hasNumber) varietyCount++
    if (hasSpecial) varietyCount++
    
    strengthScore += (varietyCount / 4) * 30
    
    // Entropy estimation contributes up to 20 points
    const uniqueChars = new Set(pass.split('')).size
    strengthScore += Math.min(20, (uniqueChars / pass.length) * 20)
    
    if (strengthScore < 40) {
      setStrength("Weak")
    } else if (strengthScore < 70) {
      setStrength("Medium")
    } else {
      setStrength("Strong")
    }
  }

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select()
    passwordRef.current?.setSelectionRange(0, 999)
    window.navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [password])

  useEffect(() => {
    passwordGenerator()
  }, [length, numberAllowed, charAllowed, passwordGenerator])

  return (
    <div className="relative w-full min-h-screen flex justify-center items-center p-5 bg-slate-900 overflow-hidden">
      {/* Particles Background */}
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
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-800 bg-opacity-80 backdrop-blur-md rounded-xl p-8 shadow-xl border border-white border-opacity-10 animate-fade-in">
        <h1 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-500 to-blue-300 bg-clip-text text-transparent">
          Secure Password Generator
        </h1>
        <p className="text-sm text-slate-400 text-center mb-6">
          Create strong, random passwords
        </p>

        {/* Password Display */}
        <div className={`flex mb-6 rounded-lg overflow-hidden transition-all duration-300 ${copied ? 'ring-2 ring-emerald-500' : ''}`}>
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
            className={`px-4 font-medium transition-colors duration-300 ${copied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          >
            {copied ? (
              <span className="animate-bounce">✓</span>
            ) : (
              'Copy'
            )}
          </button>
        </div>

        {/* Strength Indicator */}
        <div className="flex items-center mb-6 text-sm">
          <span className="text-slate-400">Strength: </span>
          <span className={`ml-2 font-semibold ${
            strength === 'Weak' ? 'text-red-500' :
            strength === 'Medium' ? 'text-yellow-500' :
            strength === 'Strong' ? 'text-emerald-500' : ''
          }`}>
            {strength}
          </span>
        </div>

        {/* Controls */}
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
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 hover:[&::-webkit-slider-thumb]:bg-indigo-400 hover:[&::-webkit-slider-thumb]:scale-110 hover:[&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:shadow-indigo-500/30 transition-all"
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
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-2 text-sm text-slate-400">Numbers</span>
            </label>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={charAllowed}
                onChange={() => setCharAllowed(!charAllowed)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-2 text-sm text-slate-400">Special Chars</span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={passwordGenerator}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30 active:translate-y-0"
        >
          Generate New Password
        </button>
      </div>

      {/* Custom animations in Tailwind config */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 1; }
          50% { transform: translateY(-100px) translateX(50px); opacity: 0.5; }
          100% { transform: translateY(-200px) translateX(100px); opacity: 0; }
        }
        .animate-float {
          animation: float 15s infinite linear;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-bounce {
          animation: bounce 0.5s;
        }
      `}</style>
    </div>
  )
}

export default App