import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import Navbar from '../components/Navbar.jsx'

/* ---------- pan/zoom tuning ---------- */

const MIN_ZOOM_2D = 0.6
const MAX_ZOOM_2D = 3
const MIN_ZOOM_3D = 0.6
const MAX_ZOOM_3D = 2.2
const ROTATE_SENSITIVITY = 0.35 // degrees of spin (left/right) per pixel dragged
const TILT_SENSITIVITY = 0.35 // degrees of tilt (up/down) per pixel dragged
const MIN_TILT = -80 // clamped so the camera never whips straight through a pole
const MAX_TILT = 80

function clampNum(v, min, max) {
  return Math.min(max, Math.max(min, v))
}

/* ---------- constants ---------- */

const MIN_YEAR = -3000 // 3000 BCE
const MAX_YEAR = 2026  // 2026 CE

const CATEGORIES = [
  { key: 'Events', label: 'Events', Icon: CoinIcon },
  { key: 'Battles', label: 'Battles', Icon: SwordsIcon },
  { key: 'Kingdoms', label: 'Kingdoms', Icon: CrownIcon },
  { key: 'Discoveries', label: 'Discoveries', Icon: CompassIcon },
  { key: 'Revolution', label: 'Revolution', Icon: RevolutionIcon },
  { key: 'Monuments', label: 'Monuments', Icon: MonumentIcon },
  { key: 'Treaties', label: 'Treaties', Icon: TreatyIcon },
]

const ERA_PRESETS = [
  { label: 'Ancient', range: [-3000, 500] },
  { label: 'Medieval', range: [500, 1500] },
  { label: 'Renaissance', range: [1400, 1700] },
  { label: 'Modern', range: [1700, 2026] },
]

/* ---------- small icon components ---------- */

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CoinIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9.5 14.5c.3 1 1.2 1.5 2.5 1.5 1.6 0 2.6-.7 2.6-1.8 0-2.4-5-1-5-3.4 0-1.1 1-1.8 2.4-1.8 1.3 0 2.2.5 2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SwordsIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M3 21l6.5-6.5M14.5 9.5L21 3l-2 6-6.5 6.5M3 3l6 6M11 11l7.5 7.5-2 2L9 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CrownIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 10h-13L4 8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14.8 9.2l-2 4.6-4.6 2 2-4.6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function RevolutionIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M4 12a8 8 0 0 1 13.6-5.7M20 12a8 8 0 0 1-13.6 5.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17.6 3.5v3.3h-3.3M6.4 20.5v-3.3h3.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MonumentIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M12 2.5l3 5.5H9l3-5.5zM7 9h10M6 21V11M10 21V11M14 21V11M18 21V11M4 21h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TreatyIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M6 3h9l4 4v14H6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ZoomInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ZoomOutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ResetViewIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M4 12a8 8 0 1 1 2.6 5.9" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M4 17v-4.5h4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CompassRoseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 6.5l2.6 5.5-2.6 5.5-2.6-5.5z" fill="var(--yellow)" />
    </svg>
  )
}

/* ---------- helpers ---------- */

function formatYear(y) {
  const n = Math.round(y)
  if (n < 0) return `${Math.abs(n)}BCE`
  if (n === 0) return '1CE'
  return `${n}CE`
}

function pct(y) {
  return ((y - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100
}

/* ---------- real-world coastline data (equirectangular) ----------
   Traced from actual longitude/latitude coordinates rather than made-up
   shapes, so both the 2D map and the 3D globe show recognizable real
   continents. These are hand-simplified (10-30 points per landmass) for
   a clean stylized look, not survey-grade GIS data. */

function projectLonLat(lon, lat) {
  const x = ((lon + 180) / 360) * 1000
  const y = ((90 - lat) / 180) * 500
  return [Number(x.toFixed(1)), Number(y.toFixed(1))]
}

// Turns the same coordinate list into a smooth closed curve (quadratic
// Bezier through each point's midpoint) instead of a hard-cornered
// straight-line polygon. At low zoom the difference is subtle, but it's
// what keeps coastlines -- especially narrow stretches like the Central
// American isthmus -- from looking like jagged, self-crossing shapes once
// you zoom in.
function pathFromLonLat(points) {
  const pts = points.map(([lon, lat]) => projectLonLat(lon, lat))
  const n = pts.length
  const midpoint = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]

  const start = midpoint(pts[n - 1], pts[0])
  let d = `M ${start[0]} ${start[1]} `
  for (let i = 0; i < n; i++) {
    const curr = pts[i]
    const next = pts[(i + 1) % n]
    const m = midpoint(curr, next)
    d += `Q ${curr[0]} ${curr[1]} ${m[0]} ${m[1]} `
  }
  return `${d}Z`
}

const WORLD_LANDMASSES = [
  // North America (Alaska -> Arctic Canada -> east coast -> Gulf ->
  // Central America -> Pacific coast -> back to Alaska)
  [
    [-168, 65], [-155, 71], [-130, 70], [-95, 68], [-75, 62], [-65, 60],
    [-55, 51], [-63, 45], [-70, 41], [-74, 40], [-76, 37], [-80, 32],
    [-80, 25], [-83, 30], [-90, 29], [-97, 26], [-97, 21], [-90, 16],
    [-84, 10], [-79, 8], [-83, 9], [-87, 13], [-92, 15], [-105, 20],
    [-112, 24], [-117, 32], [-122, 37], [-124, 46], [-130, 54],
    [-140, 60], [-152, 58], [-165, 65],
  ],
  // Greenland
  [
    [-73, 60], [-55, 60], [-42, 61], [-22, 70], [-25, 78], [-45, 83],
    [-65, 80], [-73, 70],
  ],
  // South America
  [
    [-77, 8], [-72, 11], [-61, 10], [-51, 1], [-35, -6], [-40, -14],
    [-43, -23], [-48, -27], [-53, -34], [-58, -38], [-62, -42],
    [-68, -52], [-70, -55], [-73, -50], [-72, -42], [-71, -33],
    [-70, -20], [-77, -12], [-80, -3], [-79, 2],
  ],
  // Europe (mainland, folding in a rough Italy notch)
  [
    [-9, 38], [-9, 43], [-2, 47], [5, 51], [8, 54], [10, 57], [13, 55],
    [18, 54], [20, 60], [24, 65], [30, 60], [30, 50], [28, 44],
    [23, 42], [20, 39], [18, 40], [13, 45], [12, 42], [16, 38],
    [10, 44], [3, 43], [0, 39], [-5, 36],
  ],
  // British Isles
  [
    [-8, 51], [-10, 54], [-6, 55], [-5, 58], [-2, 58], [0, 53], [1, 51],
    [-3, 50],
  ],
  // Scandinavia
  [
    [5, 58], [5, 62], [8, 66], [15, 69], [25, 70], [28, 65], [23, 60],
    [18, 59], [11, 59],
  ],
  // Africa
  [
    [-17, 21], [-17, 14], [-10, 6], [2, 6], [9, 4], [9, -1], [12, -6],
    [13, -12], [14, -22], [18, -34], [26, -33], [33, -28], [35, -20],
    [40, -11], [42, 0], [51, 10], [45, 12], [43, 12], [37, 18],
    [35, 28], [32, 31], [25, 32], [10, 37], [2, 36], [-6, 35], [-9, 30],
  ],
  // Madagascar
  [[44, -25], [43, -20], [48, -13], [50, -16], [47, -25]],
  // Arabian Peninsula
  [
    [36, 30], [43, 30], [48, 30], [56, 26], [58, 22], [53, 17],
    [44, 13], [39, 20], [35, 28],
  ],
  // Indian subcontinent
  [
    [68, 24], [70, 21], [73, 15], [77, 8], [80, 13], [85, 20], [88, 22],
    [92, 22], [88, 27], [77, 30], [70, 28],
  ],
  // Main Asian landmass (Turkey -> Siberia -> Far East -> SE Asia -> back through Iran)
  [
    [27, 40], [35, 42], [40, 47], [48, 46], [60, 55], [70, 65],
    [100, 73], [140, 73], [170, 68], [163, 60], [155, 53], [140, 46],
    [131, 43], [129, 35], [122, 31], [114, 22], [108, 16], [103, 8],
    [98, 8], [94, 16], [92, 22], [80, 30], [60, 37], [48, 38],
    [44, 37], [36, 37],
  ],
  // Japan
  [[130, 31], [133, 34], [140, 36], [142, 40], [141, 45], [139, 41], [135, 35]],
  // Sumatra
  [[96, 5], [106, -6], [102, -4], [95, 4]],
  // Borneo
  [[109, 4], [119, 4], [117, -4], [109, -1]],
  // Philippines
  [[120, 19], [122, 10], [126, 8], [124, 17]],
  // New Guinea
  [[131, -1], [151, -10], [141, -9], [131, -3]],
  // Australia
  [
    [113, -22], [122, -18], [131, -12], [137, -12], [142, -11],
    [145, -17], [151, -24], [153, -30], [150, -37], [140, -38],
    [135, -32], [129, -32], [115, -34], [113, -26],
  ],
  // New Zealand
  [[173, -41], [178, -38], [177, -35], [172, -41], [166, -46], [169, -46]],
]

const CONTINENT_PATHS = WORLD_LANDMASSES.map(pathFromLonLat)

/* ---------- world map (2D), traced from real coastlines ---------- */

function WorldMap2D() {
  return (
    <svg className="world-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ocean" cx="50%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#132043" />
          <stop offset="55%" stopColor="#0c1730" />
          <stop offset="100%" stopColor="#070c1c" />
        </radialGradient>
        <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5a3a" />
          <stop offset="100%" stopColor="#39472e" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1000" height="500" fill="url(#ocean)" />

      {/* graticule */}
      <g stroke="#ffffff10" strokeWidth="1">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={(i + 1) * 100} y1="0" x2={(i + 1) * 100} y2="500" />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={(i + 1) * 100} x2="1000" y2={(i + 1) * 100} />
        ))}
      </g>

      {/* polar ice caps */}
      <rect x="0" y="0" width="1000" height="14" fill="#e8f0f8" opacity="0.65" />
      <rect x="0" y="486" width="1000" height="14" fill="#e8f0f8" opacity="0.8" />

      {/* real-world continents, traced from lon/lat */}
      <g fill="url(#land)" stroke="#00000030" strokeWidth="1.2" strokeLinejoin="round">
        {CONTINENT_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  )
}

/* ---------- equirectangular world texture (shared look with the 2D map) ---------- */

function buildGlobeTextureCanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  const sx = canvas.width / 1000
  const sy = canvas.height / 500

  ctx.save()
  ctx.scale(sx, sy)

  const oceanGrad = ctx.createRadialGradient(500, 190, 50, 500, 190, 750)
  oceanGrad.addColorStop(0, '#132043')
  oceanGrad.addColorStop(0.55, '#0c1730')
  oceanGrad.addColorStop(1, '#070c1c')
  ctx.fillStyle = oceanGrad
  ctx.fillRect(0, 0, 1000, 500)

  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 1
  for (let i = 0; i < 9; i++) {
    ctx.beginPath()
    ctx.moveTo((i + 1) * 100, 0)
    ctx.lineTo((i + 1) * 100, 500)
    ctx.stroke()
  }
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.moveTo(0, (i + 1) * 100)
    ctx.lineTo(1000, (i + 1) * 100)
    ctx.stroke()
  }

  const landGrad = ctx.createLinearGradient(0, 0, 0, 500)
  landGrad.addColorStop(0, '#4a5a3a')
  landGrad.addColorStop(1, '#39472e')
  ctx.fillStyle = landGrad
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'
  ctx.lineWidth = 1.5
  CONTINENT_PATHS.forEach((d) => {
    const p = new Path2D(d)
    ctx.fill(p)
    ctx.stroke(p)
  })

  ctx.fillStyle = 'rgba(232,240,248,0.7)'
  ctx.fillRect(0, 0, 1000, 12)
  ctx.fillStyle = 'rgba(232,240,248,0.85)'
  ctx.fillRect(0, 488, 1000, 12)

  ctx.restore()
  return canvas
}

/* ---------- real 3D globe (WebGL sphere via three.js) ----------
   Unlike a flat div faked into looking round with gradients, this is an
   actual sphere mesh with a real light, so it stays convincingly round
   and correctly shaded from every viewing angle -- drag vertically to
   orbit over the poles, drag horizontally to spin, scroll/buttons to
   zoom -- the same feel as Google Earth. */

function Globe3D({ rotation, tilt, zoom, dragging, onPointerDown, onPointerMove, onPointerUp }) {
  const mountRef = useRef(null)
  const cameraRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const width = mount.clientWidth || 1
    const height = mount.clientHeight || 1

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height)
    mount.appendChild(renderer.domElement)

    const texture = new THREE.CanvasTexture(buildGlobeTextureCanvas())
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({ map: texture, shininess: 8, specular: 0x223355 })
    )
    scene.add(sphere)

    // thin glowing atmosphere shell, brightest at the silhouette edge --
    // this is what keeps the limb looking round instead of a hard cutout
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.035, 64, 64),
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {},
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
            gl_FragColor = vec4(0.35, 0.62, 1.0, 1.0) * clamp(intensity, 0.0, 1.0);
          }
        `,
      })
    )
    scene.add(atmosphere)

    scene.add(new THREE.AmbientLight(0xffffff, 0.55))
    const sun = new THREE.DirectionalLight(0xffffff, 1.15)
    sun.position.set(4, 2.5, 5)
    scene.add(sun)

    function renderLoop() {
      renderer.render(scene, camera)
      frameRef.current = requestAnimationFrame(renderLoop)
    }
    renderLoop()

    const resizeObserver = new ResizeObserver(() => {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })
    resizeObserver.observe(mount)

    return () => {
      cancelAnimationFrame(frameRef.current)
      resizeObserver.disconnect()
      mount.removeChild(renderer.domElement)
      sphere.geometry.dispose()
      sphere.material.dispose()
      atmosphere.geometry.dispose()
      atmosphere.material.dispose()
      texture.dispose()
      renderer.dispose()
    }
  }, [])

  // Orbit the camera around the sphere -- true spherical coordinates, so
  // the globe reads as a solid ball no matter how far it's tilted, instead
  // of a flat disc being rotated in space.
  useEffect(() => {
    const camera = cameraRef.current
    if (!camera) return
    // negated so the globe's surface follows the drag direction (grabbing
    // the sphere and turning it), instead of the camera orbiting the same
    // way the drag moved -- which visually spins the surface backwards
    const theta = THREE.MathUtils.degToRad(-rotation)
    // polar angle measured from the top pole; clamped so the camera never
    // whips straight through a pole (same guard Google Earth applies)
    const phiDeg = clampNum(90 - tilt, 12, 168)
    const phi = THREE.MathUtils.degToRad(phiDeg)
    const radius = 2.6 / clampNum(zoom, MIN_ZOOM_3D, MAX_ZOOM_3D)

    camera.position.set(
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.cos(theta)
    )
    camera.up.set(0, 1, 0)
    camera.lookAt(0, 0, 0)
  }, [rotation, tilt, zoom])

  return (
    <div
      className={`globe3d-wrap${dragging ? ' is-dragging' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="globe3d-halo" />
      <div className="globe3d-canvas-mount" ref={mountRef} />
    </div>
  )
}

/* ---------- dual range timeline ---------- */

function TimelineRange({ range, setRange }) {
  const [from, to] = range
  const dragging = useRef(null)

  function clamp(v) {
    return Math.min(MAX_YEAR, Math.max(MIN_YEAR, v))
  }

  function handleFromInput(e) {
    const v = clamp(Number(e.target.value))
    setRange([Math.min(v, to - 1), to])
  }

  function handleToInput(e) {
    const v = clamp(Number(e.target.value))
    setRange([from, Math.max(v, from + 1)])
  }

  function handleFromNumber(e) {
    const v = clamp(Number(e.target.value) || MIN_YEAR)
    setRange([Math.min(v, to - 1), to])
  }

  function handleToNumber(e) {
    const v = clamp(Number(e.target.value) || MAX_YEAR)
    setRange([from, Math.max(v, from + 1)])
  }

  const leftPct = pct(from)
  const rightPct = pct(to)
  // give the thumb that's behind (closer to the opposite edge) a higher
  // z-index so both remain draggable even when the range is narrow
  const fromOnTop = from > (MIN_YEAR + MAX_YEAR) / 2

  return (
    <div className="timeline-bar">
      <span className="timeline-label">Timeline</span>

      <div className="timeline-controls">
        <span className="timeline-caption">Show Events From</span>

        <input
          className="timeline-year-input"
          type="text"
          value={formatYear(from)}
          onChange={handleFromNumber}
          aria-label="Start year"
        />

        <div className="timeline-track-wrap">
          <div className="timeline-track">
            <div
              className="timeline-track-fill"
              style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
            />
          </div>
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={from}
            onChange={handleFromInput}
            className="timeline-thumb"
            style={{ zIndex: fromOnTop ? 3 : 2 }}
            aria-label="Start year slider"
          />
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={to}
            onChange={handleToInput}
            className="timeline-thumb"
            style={{ zIndex: fromOnTop ? 2 : 3 }}
            aria-label="End year slider"
          />
        </div>

        <span className="timeline-caption">to</span>

        <input
          className="timeline-year-input"
          type="text"
          value={formatYear(to)}
          onChange={handleToNumber}
          aria-label="End year"
        />
      </div>
    </div>
  )
}

/* ---------- main page ---------- */

export default function Explore({ events = [] }) {
  const [mode, setMode] = useState('2D')
  const [activeCategory, setActiveCategory] = useState('Events')
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [range, setRange] = useState([MIN_YEAR, MAX_YEAR])

  // -- 2D map: zoom + pan --
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panDrag = useRef(null) // { startX, startY, startPan, pointerId }
  const activePointers = useRef(new Map()) // pointerId -> { x, y } (for two-finger pinch)
  const pinchState = useRef(null) // { startDist, startZoom, startPan }

  // -- 3D globe: rotation + tilt + zoom --
  const [rotation, setRotation] = useState(0)
  const [tilt, setTilt] = useState(0)
  const [zoom3d, setZoom3d] = useState(1)
  const [manualRotate, setManualRotate] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const rotateDrag = useRef(null) // { startX, startY, startRotation, startTilt, pointerId }

  const panelRef = useRef(null)

  function clampPan(next, z) {
    const el = panelRef.current
    if (!el) return next
    const rect = el.getBoundingClientRect()
    const maxX = Math.max(0, (rect.width * (z - 1)) / 2)
    const maxY = Math.max(0, (rect.height * (z - 1)) / 2)
    return {
      x: clampNum(next.x, -maxX, maxX),
      y: clampNum(next.y, -maxY, maxY),
    }
  }

  // Zooms the 2D map while keeping the point under (clientX, clientY) fixed
  // on screen -- this is what makes scroll-to-zoom and the +/- buttons feel
  // natural instead of always re-centering on the middle of the panel.
  function zoomAtPoint(nextZoomRaw, clientX, clientY) {
    const nextZoom = clampNum(nextZoomRaw, MIN_ZOOM_2D, MAX_ZOOM_2D)
    const el = panelRef.current
    if (!el) {
      setZoom(nextZoom)
      return
    }
    const rect = el.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    const mx = clientX - rect.left
    const my = clientY - rect.top
    const ratio = nextZoom / zoom

    setPan((prev) => {
      const raw = {
        x: (mx - cx) * (1 - ratio) + prev.x * ratio,
        y: (my - cy) * (1 - ratio) + prev.y * ratio,
      }
      return clampPan(raw, nextZoom)
    })
    setZoom(nextZoom)
  }

  // Same anchored-zoom math as zoomAtPoint, but computed fresh from a fixed
  // "base" zoom/pan snapshot rather than the latest state -- used while a
  // two-finger pinch gesture is in progress so each move event is anchored
  // consistently to the moment the pinch started, instead of compounding
  // rounding drift frame over frame.
  function anchoredPanFrom(baseZoom, basePan, nextZoom, clientX, clientY) {
    const el = panelRef.current
    if (!el) return basePan
    const rect = el.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    const mx = clientX - rect.left
    const my = clientY - rect.top
    const ratio = nextZoom / baseZoom
    return {
      x: (mx - cx) * (1 - ratio) + basePan.x * ratio,
      y: (my - cy) * (1 - ratio) + basePan.y * ratio,
    }
  }

  function resetView() {
    if (mode === '2D') {
      setZoom(1)
      setPan({ x: 0, y: 0 })
    } else {
      setZoom3d(1)
      setRotation(0)
      setTilt(0)
      setManualRotate(false)
    }
  }

  function zoomButton(direction) {
    const el = panelRef.current
    if (mode === '2D') {
      const step = direction * 0.3
      if (el) {
        const rect = el.getBoundingClientRect()
        zoomAtPoint(zoom + step, rect.left + rect.width / 2, rect.top + rect.height / 2)
      } else {
        setZoom((z) => clampNum(z + step, MIN_ZOOM_2D, MAX_ZOOM_2D))
      }
    } else {
      setZoom3d((z) => clampNum(+(z + direction * 0.2).toFixed(2), MIN_ZOOM_3D, MAX_ZOOM_3D))
    }
  }

  // -- 2D drag-to-pan + two-finger pinch-to-zoom handlers --
  function handlePanPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (activePointers.current.size >= 2) {
      // A second finger just touched down -- switch from panning to pinching.
      panDrag.current = null
      setIsPanning(false)
      const pts = Array.from(activePointers.current.values()).slice(0, 2)
      const startDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      pinchState.current = { startDist, startZoom: zoom, startPan: pan }
    } else {
      setIsPanning(true)
      panDrag.current = { startX: e.clientX, startY: e.clientY, startPan: pan, pointerId: e.pointerId }
    }
  }

  function handlePanPointerMove(e) {
    if (!activePointers.current.has(e.pointerId)) return
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pinchState.current && activePointers.current.size >= 2) {
      const pts = Array.from(activePointers.current.values()).slice(0, 2)
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const { startDist, startZoom, startPan } = pinchState.current
      if (startDist === 0) return
      const nextZoom = clampNum(startZoom * (dist / startDist), MIN_ZOOM_2D, MAX_ZOOM_2D)
      const midX = (pts[0].x + pts[1].x) / 2
      const midY = (pts[0].y + pts[1].y) / 2
      const nextPan = anchoredPanFrom(startZoom, startPan, nextZoom, midX, midY)
      setZoom(nextZoom)
      setPan(clampPan(nextPan, nextZoom))
      return
    }

    if (!panDrag.current) return
    const { startX, startY, startPan } = panDrag.current
    const next = { x: startPan.x + (e.clientX - startX), y: startPan.y + (e.clientY - startY) }
    setPan(clampPan(next, zoom))
  }

  function handlePanPointerUp(e) {
    activePointers.current.delete(e.pointerId)
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId)
    } catch {
      /* no-op */
    }

    if (activePointers.current.size < 2) {
      pinchState.current = null
    }

    if (activePointers.current.size === 0) {
      panDrag.current = null
      setIsPanning(false)
    } else if (activePointers.current.size === 1) {
      // Lifted one of two pinch fingers -- resume single-finger panning
      // from wherever the remaining finger currently is.
      const [[pointerId, pos]] = Array.from(activePointers.current.entries())
      panDrag.current = { startX: pos.x, startY: pos.y, startPan: pan, pointerId }
      setIsPanning(true)
    }
  }

  function handleMapDoubleClick(e) {
    if (mode !== '2D') return
    zoomAtPoint(zoom + 0.6, e.clientX, e.clientY)
  }

  // -- 3D drag-to-rotate handlers (horizontal drag spins the view around
  // the globe, vertical drag orbits it up/down over the poles -- tilt is
  // clamped so the camera never flips upside-down through a pole, the same
  // guard Google Earth applies) --
  function handleRotatePointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return
    setManualRotate(true)
    setIsRotating(true)
    rotateDrag.current = {
      startX: e.clientX,
      startY: e.clientY,
      startRotation: rotation,
      startTilt: tilt,
      pointerId: e.pointerId,
    }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  function handleRotatePointerMove(e) {
    if (!rotateDrag.current) return
    const { startX, startY, startRotation, startTilt } = rotateDrag.current
    setRotation(startRotation + (e.clientX - startX) * ROTATE_SENSITIVITY)
    setTilt(clampNum(startTilt + (e.clientY - startY) * TILT_SENSITIVITY, MIN_TILT, MAX_TILT))
  }

  function handleRotatePointerUp(e) {
    if (rotateDrag.current) {
      try {
        e.currentTarget.releasePointerCapture?.(rotateDrag.current.pointerId)
      } catch {
        /* no-op */
      }
    }
    rotateDrag.current = null
    setIsRotating(false)
  }

  // Native (non-passive) wheel listener. The 2D map does NOT zoom on
  // scroll at all -- some touchpad drivers (notably on Windows) tag
  // ordinary two-finger scrolling with ctrlKey the same way they tag a
  // real pinch gesture, so there's no reliable way to tell them apart.
  // Zoom is available via the +/- buttons and double-click instead. The
  // 3D globe still zooms on scroll, since it has no competing "scroll the
  // page" expectation to protect.
  useEffect(() => {
    const el = panelRef.current
    if (!el) return undefined

    function onWheel(e) {
      if (mode === '2D') return // scrolling never zooms the 2D map
      e.preventDefault()
      const factor = Math.exp(-e.deltaY * 0.0016)
      setZoom3d((z) => clampNum(+(z * factor).toFixed(3), MIN_ZOOM_3D, MAX_ZOOM_3D))
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [mode, zoom])

  // Re-clamp pan if the panel is resized (e.g. window resize) so the map
  // never ends up stranded out of view.
  useEffect(() => {
    const el = panelRef.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(() => {
      setPan((prev) => clampPan(prev, zoom))
    })
    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom])

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase()
    return events.filter((ev) => {
      const inCategory = activeCategory === 'Events' ? true : ev.category === activeCategory
      const inRange = ev.year >= range[0] && ev.year <= range[1]
      const inSearch =
        !q ||
        ev.title?.toLowerCase().includes(q) ||
        ev.place?.toLowerCase().includes(q)
      return inCategory && inRange && inSearch
    })
  }, [events, activeCategory, range, search])

  function applyPreset(preset) {
    setRange(preset.range)
    setFilterOpen(false)
  }

  return (
    <div className="page explore-page">
      <Navbar active="Explore" />

      <div className="explore-toolbar">
        <div className="explore-search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search events, places or people.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="explore-filter-wrap">
          <button
            type="button"
            className="btn-filter"
            onClick={() => setFilterOpen((v) => !v)}
            aria-expanded={filterOpen}
          >
            <FilterIcon /> Filter
          </button>

          {filterOpen && (
            <div className="filter-panel">
              <span className="filter-panel-title">Jump to era</span>
              {ERA_PRESETS.map((p) => (
                <button key={p.label} type="button" onClick={() => applyPreset(p)}>
                  {p.label}
                </button>
              ))}
              <button
                type="button"
                className="filter-reset"
                onClick={() => applyPreset({ range: [MIN_YEAR, MAX_YEAR] })}
              >
                Reset range
              </button>
            </div>
          )}
        </div>

        <div className="view-toggle" role="tablist" aria-label="Map view">
          <button
            type="button"
            role="tab"
            aria-selected={mode === '2D'}
            className={mode === '2D' ? 'active' : ''}
            onClick={() => setMode('2D')}
          >
            2D
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === '3D'}
            className={mode === '3D' ? 'active' : ''}
            onClick={() => setMode('3D')}
          >
            3D
          </button>
        </div>
      </div>

      <div className="explore-body">
        <aside className="explore-sidebar">
          {CATEGORIES.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              className={key === activeCategory ? 'sidebar-item active' : 'sidebar-item'}
              onClick={() => setActiveCategory(key)}
              title={label}
            >
              <span className="sidebar-icon"><Icon /></span>
              <span className="sidebar-label">{label}</span>
            </button>
          ))}
        </aside>

        <div
          className={`map-panel${mode === '2D' && isPanning ? ' is-interacting' : ''}${mode === '3D' && isRotating ? ' is-interacting' : ''}`}
          ref={panelRef}
        >
          {mode === '2D' ? (
            <div
              className={`map-viewport${isPanning ? ' is-dragging' : ''}`}
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
              onPointerDown={handlePanPointerDown}
              onPointerMove={handlePanPointerMove}
              onPointerUp={handlePanPointerUp}
              onPointerCancel={handlePanPointerUp}
              onDoubleClick={handleMapDoubleClick}
            >
              <WorldMap2D />
            </div>
          ) : (
            <div className="map-viewport">
              <Globe3D
                rotation={rotation}
                tilt={tilt}
                zoom={zoom3d}
                dragging={isRotating}
                onPointerDown={handleRotatePointerDown}
                onPointerMove={handleRotatePointerMove}
                onPointerUp={handleRotatePointerUp}
              />
            </div>
          )}

          {filteredEvents.length === 0 && (
            <div className="map-empty-note">
              No dataset connected yet — pins will appear here once events are loaded.
            </div>
          )}

          <div className="map-hint">
            {mode === '2D' ? 'Drag to pan · Pinch or +/- to zoom · Double-click to zoom in' : 'Drag to rotate · Scroll or +/- to zoom'}
          </div>

          <div className="map-zoom-controls">
            <button type="button" onClick={() => zoomButton(1)} aria-label="Zoom in">
              <ZoomInIcon />
            </button>
            <button type="button" onClick={() => zoomButton(-1)} aria-label="Zoom out">
              <ZoomOutIcon />
            </button>
            <button type="button" onClick={resetView} aria-label="Reset view" className="map-zoom-reset">
              <ResetViewIcon />
            </button>
          </div>

          <div className="map-compass">
            <CompassRoseIcon />
          </div>
        </div>
      </div>

      <TimelineRange range={range} setRange={setRange} />
    </div>
  )
}
