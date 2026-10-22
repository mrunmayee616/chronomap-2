import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { PLACES as STATIC_PLACES } from '../data/places.js'
import { placesApi } from '../lib/api.js'
import { applyEditToPlace } from '../lib/placeEdits.js'
import { dedupeQuiz } from '../lib/quiz.js'
import { PLACE_IMAGE_OVERRIDES } from '../data/placeImages.generated.js'

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
  const [quizAdditions, setQuizAdditions] = useState({})
  const [loaded, setLoaded] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const data = await placesApi.overrides()
      setRemovedIds(data.removedIds || [])
      setAddedPlaces(data.addedPlaces || [])
      setEdits(data.edits || {})
      setQuizAdditions(data.quizAdditions || {})
    } catch {
      // Server unreachable -- fall back to the static dataset, unmodified.
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const places = useMemo(() => {
    const removedSet = new Set(removedIds)
    const staticMerged = STATIC_PLACES.filter((p) => !removedSet.has(p.id)).map((p) => {
      // Real Wikipedia photos (src/data/placeImages.generated.js) replace the
      // placeholder hero image and gallery, unless an admin has since set
      // their own image for this place -- that edit always wins.
      const override = PLACE_IMAGE_OVERRIDES[p.id]
      const withRealImages = override ? { ...p, image: override.image, gallery: override.gallery } : p
      return edits[p.id] ? applyEditToPlace(withRealImages, edits[p.id]) : withRealImages
    })
    // Admin-written questions (marked custom: true) go after the bundled ones.
    // dedupeQuiz keeps the first of any repeat, so a bundled question always
    // wins over a copy -- the dashboard warns before such a copy is saved.
    return staticMerged
      .concat(addedPlaces)
      .map((p) => ({ ...p, quiz: dedupeQuiz([...(p.quiz || []), ...(quizAdditions[p.id] || [])]) }))
  }, [removedIds, addedPlaces, edits, quizAdditions])

  const getPlaceById = useCallback((id) => places.find((p) => p.id === id), [places])

  return (
    <PlacesContext.Provider value={{ places, getPlaceById, loaded, refresh, removedIds, addedPlaces, edits, quizAdditions }}>
      {children}
    </PlacesContext.Provider>
  )
}

export function usePlaces() {
  const ctx = useContext(PlacesContext)
  if (!ctx) throw new Error('usePlaces must be used within a PlacesProvider')
  return ctx
}
