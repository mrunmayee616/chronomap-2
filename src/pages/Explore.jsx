import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Navbar from '../components/Navbar.jsx'
import { usePlaces } from '../context/PlacesContext.jsx'

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

/* ---------- real 2D map (Leaflet + real OpenStreetMap tiles) ----------
   This mounts an actual Leaflet slippy map with genuine OSM raster tiles,
   instead of a hand-drawn SVG world. Panning, pinch/scroll zoom, momentum
   and tile loading are all handled by Leaflet itself. */

const LeafletMap2D = forwardRef(function LeafletMap2D({ mode, places = [] }, ref) {
  const mountRef = useRef(null)
  const mapRef = useRef(null)
  const markersLayerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!mountRef.current || mapRef.current) return undefined

    const map = L.map(mountRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 19,
      worldCopyJump: true,
      zoomControl: false,
      attributionControl: true,
    })

    // Standard OSM tiles render place names in each region's local language,
    // so this uses Wikimedia's "osm-intl" tile set with an explicit
    // lang=en query param instead -- same OSM data, but every label is
    // forced to English (falling back to a Latin-script transliteration
    // where no English name exists in the data).
    L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=en', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors | Tiles &copy; <a href="https://wikimediafoundation.org/" target="_blank" rel="noreferrer">Wikimedia</a>',
    }).addTo(map)

    markersLayerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map
    // Leaflet measures its container on creation; if that happened while the
    // panel was still mid-layout (e.g. right after a page transition), the
    // tiles come in misaligned until something nudges it -- so nudge it once
    // more on the next frame.
    requestAnimationFrame(() => map.invalidateSize())

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Leaflet caches its container size, so switching back to 2D after a
  // stretch in 3D (or any panel resize) needs an explicit re-measure or the
  // tiles render into a stale, wrongly-sized grid.
  useEffect(() => {
    if (mode === '2D') {
      requestAnimationFrame(() => mapRef.current?.invalidateSize())
    }
  }, [mode])

  // Plot one pin per dataset entry -- re-runs whenever `places` changes, so
  // swapping in the real dataset later just makes these pins update.
  useEffect(() => {
    const layer = markersLayerRef.current
    if (!layer) return
    layer.clearLayers()

    places.forEach((place) => {
      if (!place.coords) return
      const icon = L.divIcon({
        className: 'place-pin-icon',
        html: `
          <svg class="place-pin" width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13 33S2 20.6 2 12.5C2 6.1 6.9 1 13 1s11 5.1 11 11.5C24 20.6 13 33 13 33z"
              fill="var(--yellow)"
              stroke="#1a1300"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <circle cx="13" cy="12.5" r="4" fill="#1a1300" />
          </svg>
        `,
        iconSize: [26, 34],
        iconAnchor: [13, 34],
      })
      const marker = L.marker([place.coords.lat, place.coords.lng], { icon })
      marker.bindTooltip(place.name, { direction: 'top', offset: [0, -30] })
      marker.on('click', () => navigate(`/place/${place.id}`))
      marker.addTo(layer)
    })
  }, [places, navigate])

  useImperativeHandle(ref, () => ({
    zoomIn() {
      mapRef.current?.zoomIn()
    },
    zoomOut() {
      mapRef.current?.zoomOut()
    },
    reset() {
      mapRef.current?.setView([20, 0], 2)
    },
  }))

  return (
    <div
      className="leaflet-mount"
      ref={mountRef}
      style={{ display: mode === '2D' ? 'block' : 'none' }}
    />
  )
})

/* ---------- shared pin artwork (2D + 3D use the same shape) ---------- */

const PIN_FILL_COLOR = '#f7c740'
const PIN_STROKE_COLOR = '#1a1300'

// Cesium billboards render onto a canvas texture outside the DOM, so they
// can't read CSS custom properties the way the Leaflet divIcon SVG does --
// this builds the same pin shape as a literal-color data URL for that case.
function buildPinDataUrl() {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="34" viewBox="0 0 26 34">` +
    `<path d="M13 33S2 20.6 2 12.5C2 6.1 6.9 1 13 1s11 5.1 11 11.5C24 20.6 13 33 13 33z" fill="${PIN_FILL_COLOR}" stroke="${PIN_STROKE_COLOR}" stroke-width="2" stroke-linejoin="round"/>` +
    `<circle cx="13" cy="12.5" r="4" fill="${PIN_STROKE_COLOR}"/>` +
    `</svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

/* ---------- real 3D globe (CesiumJS + real OpenStreetMap imagery) ----------
   Cesium is a real digital-globe engine -- the same category of tech behind
   Google Earth's web viewer -- so this renders actual map imagery on a true
   globe with its own camera system: left-drag to orbit, right-drag (or
   ctrl+drag) to tilt, scroll to zoom. Because there's no artificial circular
   mask around it (see .leaflet-mount / .cesium-mount in index.css), the
   sphere's own curved edge is the only thing that can ever "cut" the frame,
   and only for as long as the globe is genuinely small enough to be smaller
   than the frame -- zoom in far enough and it fills the whole panel with no
   cutoff, the same way Google Earth behaves.

   Cesium is a large library, so it's imported dynamically the first time the
   3D tab is actually opened rather than bundled into the initial page load.
   Once created, the viewer is kept alive (just hidden with CSS) so switching
   back and forth between 2D/3D doesn't lose your place on the globe. */

const CesiumGlobe3D = forwardRef(function CesiumGlobe3D({ mode, places = [] }, ref) {
  const mountRef = useRef(null)
  const viewerRef = useRef(null)
  const cesiumRef = useRef(null)
  const initStarted = useRef(false)
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (mode !== '3D' || initStarted.current) return undefined
    initStarted.current = true
    let cancelled = false

    ;(async () => {
      const [Cesium] = await Promise.all([
        import('cesium'),
        import('cesium/Build/Cesium/Widgets/widgets.css'),
      ])
      if (cancelled || !mountRef.current) return

      // Real satellite/aerial photography (Esri World Imagery), not a
      // stylized road map -- this is what actually gives the globe true
      // earth-like coloring: blue oceans, green forests, brown deserts,
      // white ice, instead of OSM's flat cream-and-beige road-map palette.
      // fromBasemapType() is async (it fetches Esri's basemap style/tiling
      // metadata first), so it's handed to ImageryLayer.fromProviderAsync
      // rather than wrapped synchronously like the old OSM provider was.
      const viewer = new Cesium.Viewer(mountRef.current, {
        baseLayer: Cesium.ImageryLayer.fromProviderAsync(
          Cesium.ArcGisMapServerImageryProvider.fromBasemapType(
            Cesium.ArcGisBaseMapType.SATELLITE
          )
        ),
        terrainProvider: new Cesium.EllipsoidTerrainProvider(),
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        infoBox: false,
        selectionIndicator: false,
      })

      // Ocean-blue fallback while the satellite imagery is still loading in,
      // instead of Cesium's default light-grey globe.
      viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#1b3a5c')

      // Off by default in Cesium, which means entities are never occluded
      // by the globe itself -- a pin on the far side of the earth would
      // keep rendering on top of the visible near side. Turning this on is
      // what makes a pin actually disappear behind the horizon as it
      // should, instead of appearing to drift across the visible globe as
      // you rotate it.
      viewer.scene.globe.depthTestAgainstTerrain = true

      // Plain satellite imagery has no place names on it at all, so this
      // adds Esri's "World Boundaries and Places" reference layer on top --
      // country/state/city labels (in English) plus admin boundaries,
      // purpose-built to sit over a dark basemap like satellite imagery.
      try {
        const labelsProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer'
        )
        if (cancelled) return
        viewer.imageryLayers.addImageryProvider(labelsProvider)
      } catch (err) {
        // Labels are a nice-to-have on top of the globe -- if the reference
        // service is unreachable, fail quietly and keep the satellite base.
        console.warn('Globe labels layer failed to load:', err)
      }

      viewerRef.current = viewer
      cesiumRef.current = Cesium
      setReady(true)
    })()

    return () => {
      cancelled = true
    }
  }, [mode])

  // Plot one pin per dataset entry, mirroring LeafletMap2D. Pins are added
  // as billboards -- flat, always-camera-facing 2D sprites -- rather than
  // ground-hugging shapes, so the pin never distorts or flips as the globe
  // rotates or tilts. Each sits a couple hundred meters above the surface
  // (rather than exactly on it) purely to avoid z-fighting flicker against
  // the ellipsoid at grazing viewing angles -- with depthTestAgainstTerrain
  // now on, the globe itself correctly hides a pin once it rotates onto the
  // far side, instead of it drawing through the earth.
  useEffect(() => {
    const viewer = viewerRef.current
    const Cesium = cesiumRef.current
    if (!viewer || !Cesium || !ready) return undefined

    viewer.entities.removeAll()
    const pinImage = buildPinDataUrl()

    places.forEach((place) => {
      if (!place.coords) return
      viewer.entities.add({
        id: `place-${place.id}`,
        position: Cesium.Cartesian3.fromDegrees(place.coords.lng, place.coords.lat, 200),
        billboard: {
          image: pinImage,
          width: 26,
          height: 34,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          disableDepthTestDistance: 0,
          scaleByDistance: new Cesium.NearFarScalar(1.0e6, 1, 2.5e7, 0.5),
        },
      })
    })

    return () => {
      viewer.entities.removeAll()
    }
  }, [places, ready])

  // Click a pin to open its place page (same behavior as the 2D markers),
  // and swap in a pointer cursor while hovering one.
  useEffect(() => {
    const viewer = viewerRef.current
    const Cesium = cesiumRef.current
    if (!viewer || !Cesium || !ready) return undefined

    const handler = viewer.screenSpaceEventHandler

    function placeIdFromPick(picked) {
      const id = picked?.id?.id
      return typeof id === 'string' && id.startsWith('place-') ? id.slice('place-'.length) : null
    }

    function onClick(movement) {
      const placeId = placeIdFromPick(viewer.scene.pick(movement.position))
      if (placeId) navigate(`/place/${placeId}`)
    }

    function onMove(movement) {
      const placeId = placeIdFromPick(viewer.scene.pick(movement.endPosition))
      viewer.scene.canvas.style.cursor = placeId ? 'pointer' : ''
    }

    handler.setInputAction(onClick, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    handler.setInputAction(onMove, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    return () => {
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }
  }, [ready, navigate])

  // Only torn down when the page itself unmounts, not on every 2D/3D toggle.
  useEffect(
    () => () => {
      viewerRef.current?.destroy()
      viewerRef.current = null
    },
    []
  )

  useImperativeHandle(ref, () => ({
    zoomIn() {
      const viewer = viewerRef.current
      if (!viewer) return
      viewer.camera.zoomIn(viewer.camera.positionCartographic.height * 0.3)
    },
    zoomOut() {
      const viewer = viewerRef.current
      if (!viewer) return
      viewer.camera.zoomOut(viewer.camera.positionCartographic.height * 0.4)
    },
    reset() {
      viewerRef.current?.camera.flyHome(0.6)
    },
  }))

  return (
    <div
      className="cesium-mount"
      ref={mountRef}
      style={{ display: mode === '3D' ? 'block' : 'none' }}
    />
  )
})


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

export default function Explore() {
  const { places: PLACES } = usePlaces()
  const [mode, setMode] = useState('2D')
  const [activeCategory, setActiveCategory] = useState('Events')
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [range, setRange] = useState([MIN_YEAR, MAX_YEAR])

  // Imperative handles onto the real map engines -- Leaflet owns the 2D
  // pan/zoom state, Cesium owns the 3D camera, so the zoom buttons and
  // reset-view button just delegate to whichever one is active.
  const leafletApiRef = useRef(null)
  const cesiumApiRef = useRef(null)

  function zoomButton(direction) {
    if (mode === '2D') {
      if (direction > 0) leafletApiRef.current?.zoomIn()
      else leafletApiRef.current?.zoomOut()
    } else if (direction > 0) {
      cesiumApiRef.current?.zoomIn()
    } else {
      cesiumApiRef.current?.zoomOut()
    }
  }

  function resetView() {
    if (mode === '2D') leafletApiRef.current?.reset()
    else cesiumApiRef.current?.reset()
  }

  // Filters run against the real dataset now: category matches each place's
  // own tag (or passes everything when "Events" -- the catch-all tab -- is
  // active), the year range keeps any place whose span overlaps the
  // selected [from, to] window (not just ones fully inside it), and search
  // matches on name/location/tags so typing "rome" or "italy" both work.
  const filteredPlaces = useMemo(() => {
    const q = search.trim().toLowerCase()
    return PLACES.filter((place) => {
      const inCategory = activeCategory === 'Events' ? true : place.category === activeCategory
      const placeStart = place.yearStart ?? place.yearEnd ?? MIN_YEAR
      const placeEnd = place.yearEnd ?? place.yearStart ?? MAX_YEAR
      const inRange = placeEnd >= range[0] && placeStart <= range[1]
      const inSearch =
        !q ||
        place.name?.toLowerCase().includes(q) ||
        place.location?.toLowerCase().includes(q) ||
        place.tags?.some((t) => t.toLowerCase().includes(q))
      return inCategory && inRange && inSearch
    })
  }, [PLACES, activeCategory, range, search])

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

        <div className="map-panel">
          <LeafletMap2D ref={leafletApiRef} mode={mode} places={filteredPlaces} />
          <CesiumGlobe3D ref={cesiumApiRef} mode={mode} places={filteredPlaces} />

          {filteredPlaces.length === 0 && (
            <div className="map-empty-note">
              No places match the current filters — try widening the timeline or clearing the search.
            </div>
          )}

          <div className="map-hint">
            {mode === '2D'
              ? 'Drag to pan · Scroll or +/- to zoom · Double-click to zoom in'
              : 'Drag to orbit · Right-drag to tilt · Scroll or +/- to zoom'}
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
