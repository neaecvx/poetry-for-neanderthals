// Web Audio API synthesised sounds - no binary assets needed
let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

export function playBonk() {
  const c = getCtx()
  const t = c.currentTime
  // wooden thud: low noise burst + descending sine
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(180, t)
  osc.frequency.exponentialRampToValueAtTime(60, t + 0.18)
  gain.gain.setValueAtTime(0.8, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
  osc.connect(gain).connect(c.destination)
  osc.start(t)
  osc.stop(t + 0.25)
  // crack
  const buf = c.createBuffer(1, c.sampleRate * 0.06, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const noise = c.createBufferSource()
  const nGain = c.createGain()
  nGain.gain.setValueAtTime(0.4, t)
  nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06)
  noise.buffer = buf
  noise.connect(nGain).connect(c.destination)
  noise.start(t)
}

export function playYes() {
  const c = getCtx()
  const t = c.currentTime
  ;[523.25, 659.25].forEach((f, i) => {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(f, t + i * 0.09)
    gain.gain.setValueAtTime(0.35, t + i * 0.09)
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.22)
    osc.connect(gain).connect(c.destination)
    osc.start(t + i * 0.09)
    osc.stop(t + i * 0.09 + 0.25)
  })
}

export function playTick() {
  const c = getCtx()
  const t = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(900, t)
  gain.gain.setValueAtTime(0.12, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
  osc.connect(gain).connect(c.destination)
  osc.start(t)
  osc.stop(t + 0.06)
}

export function playWin() {
  const c = getCtx()
  const t = c.currentTime
  ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(f, t + i * 0.12)
    gain.gain.setValueAtTime(0.4, t + i * 0.12)
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.3)
    osc.connect(gain).connect(c.destination)
    osc.start(t + i * 0.12)
    osc.stop(t + i * 0.12 + 0.35)
  })
}
