import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { PLACES as STATIC_PLACES } from '../data/places.js'
import { placesApi } from '../lib/api.js'
import { applyEditToPlace } from '../lib/placeEdits.js'
<<<<<<< HEAD
import { PLACE_IMAGE_OVERRIDES } from '../data/placeImages.generated.js'
=======
import { dedupeQuiz, normalizeQuestionText } from '../lib/quiz.js'
import { QUIZ_BANK } from '../data/quizBank.js'
import { isRandomPlaceholder, placeholderImage } from '../lib/placeholderImage.js'
import { PLACE_IMAGE_OVERRIDES } from '../data/placeImages.generated.js'
import { getCachedPlaceImages, loadLivePlaceImages } from '../lib/livePlaceImages.js'
>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)

const PlacesContext = createContext(null)

// The bulk of the dataset ships as a static file in the bundle (see
// src/data/places.js). The admin dashboard can hide a static place, edit
// one, or add a brand new one -- all three are stored server-side as a
// small delta and fetched here, then merged client-side so every page
// (Explore, Place, Quiz) sees one consistent, "live" place list without
// needing the full dataset to round-trip through the API.
export function PlacesProvider({ children }) {
  const [removedIds, setRemovedIds] = useState([])
  const [addedPlaces, setAddedPlaces] = useState([])
  const [edits, setEdits] = useState({})
<<<<<<< HEAD
=======
  const [extraQuestions, setExtraQuestions] = useState({})
  const [serverImages, setServerImages] = useState({})
  const [liveImages, setLiveImages] = useState(() => getCachedPlaceImages())
>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)
  const [loaded, setLoaded] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const data = await placesApi.overrides()
      setRemovedIds(data.removedIds || [])
      setAddedPlaces(data.addedPlaces || [])
      setEdits(data.edits || {})
<<<<<<< HEAD
=======
      setExtraQuestions(data.extraQuestions || {})
>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)
    } catch {
      // Server unreachable -- fall back to the static dataset, unmodified.
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

<<<<<<< HEAD
=======
  // Real photos the server has found on Wikipedia. Separate from the
  // overrides call so a failure here never affects the rest of the data.
  useEffect(() => {
    let cancelled = false
    placesApi
      .images()
      .then((data) => !cancelled && setServerImages(data.images || {}))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // Fallback that needs no server: look each place's own Wikipedia photo up
  // in the browser (cached), for any place the server hasn't supplied.
  useEffect(() => {
    const ctrl = new AbortController()
    const names = Object.fromEntries(STATIC_PLACES.map((p) => [p.id, p.name]))
    const have = new Set([...Object.keys(PLACE_IMAGE_OVERRIDES), ...Object.keys(serverImages)])
    loadLivePlaceImages(names, have, (id, set) => setLiveImages((prev) => ({ ...prev, [id]: set })), ctrl.signal)
    return () => ctrl.abort()
  }, [serverImages])

>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)
  const places = useMemo(() => {
    const removedSet = new Set(removedIds)
    const staticMerged = STATIC_PLACES.filter((p) => !removedSet.has(p.id)).map((p) => {
      // Real Wikipedia photos (src/data/placeImages.generated.js) replace the
      // placeholder hero image and gallery, unless an admin has since set
      // their own image for this place -- that edit always wins.
<<<<<<< HEAD
      const override = PLACE_IMAGE_OVERRIDES[p.id]
      const withRealImages = override ? { ...p, image: override.image, gallery: override.gallery } : p
      return edits[p.id] ? applyEditToPlace(withRealImages, edits[p.id]) : withRealImages
    })
    return staticMerged.concat(addedPlaces)
  }, [removedIds, addedPlaces, edits])
=======
      // Priority: an admin's own image > the baked-in sync file > photos the
      // server found on Wikipedia > the dataset's own image.
      const override = PLACE_IMAGE_OVERRIDES[p.id] || serverImages[p.id] || liveImages[p.id]
      const withRealImages = override ? { ...p, image: override.image, gallery: override.gallery } : p
      return edits[p.id] ? applyEditToPlace(withRealImages, edits[p.id]) : withRealImages
    })
    // Each place's quiz is the curated question bank (src/data/quizBank.js:
    // hand-written, place-specific, no repeats anywhere), followed by any
    // questions an admin added. Places without a curated set -- ones an admin
    // created from the dashboard -- fall back to their generated quiz,
    // de-duplicated. An admin question that repeats one already in the quiz
    // is skipped, so a player never sees the same question twice.
    return staticMerged.concat(addedPlaces).map((p) => {
      // Never show a random stock photo: picsum.photos URLs (the dataset's
      // original placeholders, and the fallback for new admin places) become
      // a neutral labelled card until a real photo is available.
      const image = isRandomPlaceholder(p.image) ? placeholderImage(p) : p.image
      let gallery = (p.gallery || []).filter((g) => !isRandomPlaceholder(g.image))
      if (gallery.length === 0) gallery = [{ image, caption: p.name }]
      p = { ...p, image, gallery }
      const base = QUIZ_BANK[p.id] || dedupeQuiz(p.quiz)
      const seen = new Set(base.map((q) => normalizeQuestionText(q.question)))
      const extras = (extraQuestions[p.id] || []).filter((q) => {
        const key = normalizeQuestionText(q.question)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      return { ...p, quiz: [...base, ...extras] }
    })
  }, [removedIds, addedPlaces, edits, extraQuestions, serverImages, liveImages])
>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)

  const getPlaceById = useCallback((id) => places.find((p) => p.id === id), [places])

  return (
<<<<<<< HEAD
    <PlacesContext.Provider value={{ places, getPlaceById, loaded, refresh, removedIds, addedPlaces, edits }}>
=======
    <PlacesContext.Provider value={{ places, getPlaceById, loaded, refresh, removedIds, addedPlaces, edits, extraQuestions }}>
>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)
      {children}
    </PlacesContext.Provider>
  )
}

export function usePlaces() {
  const ctx = useContext(PlacesContext)
  if (!ctx) throw new Error('usePlaces must be used within a PlacesProvider')
  return ctx
}
