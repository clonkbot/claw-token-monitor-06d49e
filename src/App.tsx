import { useState, useEffect, useCallback } from 'react'

interface Token {
  id: string
  name: string
  symbol: string
  launchTime: Date
  price: number
  liquidity: number
  change24h: number
  isNew: boolean
  chain: string
}

const CLAW_NAMES = [
  'ClawFi', 'DragonClaw', 'BearClaw', 'ClawDAO', 'TigerClaw', 
  'ClawSwap', 'PhantomClaw', 'ClawVerse', 'IronClaw', 'ClawPunk',
  'ShadowClaw', 'ClawMoon', 'NeonClaw', 'ClawX', 'CyberClaw',
  'ClawStrike', 'GoldenClaw', 'ClawChain', 'ClawBit', 'VoidClaw',
  'ClawNinja', 'RaptorClaw', 'ClawFlux', 'DeathClaw', 'ClawForce'
]

const CHAINS = ['ETH', 'BSC', 'SOL', 'ARB', 'AVAX', 'MATIC']

const generateToken = (): Token => {
  const baseName = CLAW_NAMES[Math.floor(Math.random() * CLAW_NAMES.length)]
  const suffix = Math.random() > 0.5 ? ` ${Math.floor(Math.random() * 100)}` : ''
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: `${baseName}${suffix}`,
    symbol: `$${baseName.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5)}`,
    launchTime: new Date(),
    price: Math.random() * 0.01,
    liquidity: Math.floor(Math.random() * 500000) + 10000,
    change24h: (Math.random() - 0.3) * 200,
    isNew: true,
    chain: CHAINS[Math.floor(Math.random() * CHAINS.length)]
  }
}

const ClawIcon = () => (
  <svg className="w-10 h-10 claw-icon" viewBox="0 0 64 64" fill="none">
    <path d="M12 48C8 40 10 28 18 20C22 16 28 14 32 14" stroke="url(#claw-grad)" strokeWidth="3" strokeLinecap="round"/>
    <path d="M22 52C20 44 24 32 34 24C40 20 48 20 52 22" stroke="url(#claw-grad)" strokeWidth="3" strokeLinecap="round"/>
    <path d="M36 54C38 46 44 36 54 32C58 30 62 30 64 32" stroke="url(#claw-grad)" strokeWidth="3" strokeLinecap="round"/>
    <defs>
      <linearGradient id="claw-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f5ff"/>
        <stop offset="100%" stopColor="#ff00ff"/>
      </linearGradient>
    </defs>
  </svg>
)

const StatusDot = ({ isLive }: { isLive: boolean }) => (
  <span className={`inline-block w-2 h-2 rounded-full ${isLive ? 'bg-green-400 status-live' : 'bg-red-500'}`} />
)

const TokenCard = ({ token, index }: { token: Token; index: number }) => {
  const timeSinceLaunch = Math.floor((Date.now() - token.launchTime.getTime()) / 1000)
  const timeDisplay = timeSinceLaunch < 60 
    ? `${timeSinceLaunch}s ago` 
    : timeSinceLaunch < 3600 
      ? `${Math.floor(timeSinceLaunch / 60)}m ago`
      : `${Math.floor(timeSinceLaunch / 3600)}h ago`

  return (
    <div 
      className={`token-card ${token.isNew ? 'new' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="card-border p-[1px] rounded-lg">
        <div className="bg-[#0a0614]/95 backdrop-blur-sm rounded-lg p-4 h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center border border-cyan-500/30">
                <span className="text-lg font-bold gradient-text">{token.symbol[1]}</span>
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-white text-sm tracking-wide">{token.name}</h3>
                <p className="text-cyan-400 text-xs font-medium">{token.symbol}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {token.chain}
              </span>
              {token.isNew && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-magenta-500/20 text-pink-300 border border-pink-500/30 animate-pulse">
                  NEW
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-black/40 rounded p-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Price</p>
              <p className="text-cyan-400 font-mono text-sm">${token.price.toFixed(8)}</p>
            </div>
            <div className="bg-black/40 rounded p-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Liquidity</p>
              <p className="text-white font-mono text-sm">${token.liquidity.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              <span className="text-cyan-500">⏱</span> {timeDisplay}
            </span>
            <span className={token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
              {token.change24h >= 0 ? '▲' : '▼'} {Math.abs(token.change24h).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatsBar = ({ tokens }: { tokens: Token[] }) => {
  const totalLiquidity = tokens.reduce((sum, t) => sum + t.liquidity, 0)
  const newCount = tokens.filter(t => t.isNew).length
  
  return (
    <div className="flex flex-wrap gap-4 md:gap-8 justify-center mb-8">
      <div className="text-center">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Tokens Tracked</p>
        <p className="text-2xl font-orbitron font-bold neon-glow text-cyan-400">{tokens.length}</p>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">New (5min)</p>
        <p className="text-2xl font-orbitron font-bold neon-glow-magenta text-pink-400">{newCount}</p>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Total Liquidity</p>
        <p className="text-2xl font-orbitron font-bold text-white">${(totalLiquidity / 1000000).toFixed(2)}M</p>
      </div>
    </div>
  )
}

export default function App() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChain, setSelectedChain] = useState('ALL')
  const [isLive, setIsLive] = useState(true)

  const addNewToken = useCallback(() => {
    const newToken = generateToken()
    setTokens(prev => {
      const updated = prev.map(t => ({
        ...t,
        isNew: (Date.now() - t.launchTime.getTime()) < 300000
      }))
      return [newToken, ...updated].slice(0, 50)
    })
  }, [])

  useEffect(() => {
    // Initial tokens
    const initialTokens = Array.from({ length: 8 }, () => {
      const token = generateToken()
      token.launchTime = new Date(Date.now() - Math.random() * 3600000)
      token.isNew = (Date.now() - token.launchTime.getTime()) < 300000
      return token
    })
    setTokens(initialTokens)
  }, [])

  useEffect(() => {
    if (!isLive) return
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        addNewToken()
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [isLive, addNewToken])

  const filteredTokens = tokens.filter(token => {
    const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesChain = selectedChain === 'ALL' || token.chain === selectedChain
    return matchesSearch && matchesChain
  })

  return (
    <div className="min-h-screen grid-bg text-white relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-cyan-900/10 pointer-events-none" />
      
      <div className="relative z-10 px-4 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <ClawIcon />
            <h1 className="font-orbitron text-4xl md:text-5xl font-black tracking-wider claw-scratch">
              <span className="gradient-text">CLAW</span>
              <span className="text-white/80"> MONITOR</span>
            </h1>
            <ClawIcon />
          </div>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            Real-time Token Launch Tracker
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <StatusDot isLive={isLive} />
            <span className={`text-xs font-mono ${isLive ? 'text-green-400' : 'text-red-400'}`}>
              {isLive ? 'LIVE FEED ACTIVE' : 'FEED PAUSED'}
            </span>
          </div>
        </header>

        {/* Stats */}
        <StatsBar tokens={tokens} />

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 pulse-border transition-all font-mono"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500/50">⌘K</span>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 cursor-pointer font-mono"
            >
              <option value="ALL">All Chains</option>
              {CHAINS.map(chain => (
                <option key={chain} value={chain}>{chain}</option>
              ))}
            </select>
            
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-4 py-3 rounded-lg border text-sm font-mono transition-all ${
                isLive 
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 hover:bg-cyan-500/30' 
                  : 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30'
              }`}
            >
              {isLive ? '⏸ PAUSE' : '▶ RESUME'}
            </button>
          </div>
        </div>

        {/* Token Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTokens.map((token, index) => (
            <TokenCard key={token.id} token={token} index={index} />
          ))}
        </div>

        {filteredTokens.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 font-mono">No tokens found matching your criteria</p>
            <p className="text-cyan-500/50 text-sm mt-2">Waiting for new CLAW launches...</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-cyan-500/10 text-center">
          <p className="text-gray-600 text-xs tracking-wider">
            Requested by <span className="text-gray-500">@villainmonkey</span> · Built by <span className="text-gray-500">@clonkbot</span>
          </p>
        </footer>
      </div>
    </div>
  )
}