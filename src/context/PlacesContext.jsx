
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react'

import { PLACES as STATIC_PLACES } from '../data/places.js'
import { placesApi } from '../lib/api.js'
import { applyEditToPlace } from '../lib/placeEdits.js'
import { dedupeQuiz, normalizeQuestionText } from '../lib/quiz.js'
import { QUIZ_BANK } from '../data/quizBank.js'
import { isRandomPlaceholder, placeholderImage } from '../lib/placeholderImage.js'
import { PLACE_IMAGE_OVERRIDES } from '../data/placeImages.generated.js'
import {
  getCachedPlaceImages,
  loadLivePlaceImages,
} from '../lib/livePlaceImages.js'

const PlacesContext = createContext(null)

export function PlacesProvider({ children }) {
  const [removedIds, setRemovedIds] = useState([])
  const [addedPlaces, setAddedPlaces] = useState([])
  const [edits, setEdits] = useState({})
  const [extraQuestions, setExtraQuestions] = useState({})
  const [serverImages, setServerImages] = useState({})
  const [liveImages, setLiveImages] = useState(() =>
    getCachedPlaceImages()
  )
  const [loaded, setLoaded] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const data = await placesApi.overrides()

      setRemovedIds(data.removedIds || [])
      setAddedPlaces(data.addedPlaces || [])
      setEdits(data.edits || {})
      setExtraQuestions(data.extraQuestions || {})
    } catch {
      // Server unavailable: use the static dataset.
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Fetch real place images from the server.
  useEffect(() => {
    let cancelled = false

    placesApi
      .images()
      .then((data) => {
        if (!cancelled) {
          setServerImages(data.images || {})
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  // Look up additional Wikipedia images in the browser.
  useEffect(() => {
    const ctrl = new AbortController()

    const names = Object.fromEntries(
      STATIC_PLACES.map((p) => [p.id, p.name])
    )

    const have = new Set([
      ...Object.keys(PLACE_IMAGE_OVERRIDES),
      ...Object.keys(serverImages),
    ])

    loadLivePlaceImages(
      names,
      have,
      (id, imageSet) =>
        setLiveImages((prev) => ({
          ...prev,
          [id]: imageSet,
        })),
      ctrl.signal
    )

    return () => ctrl.abort()
  }, [serverImages])

  const places = useMemo(() => {
    const removedSet = new Set(removedIds)

    const staticMerged = STATIC_PLACES
      .filter((p) => !removedSet.has(p.id))
      .map((p) => {
        // Image priority:
        // Admin edits > generated overrides > server images > live images
        // > original dataset image.
        const override =
          PLACE_IMAGE_OVERRIDES[p.id] ||
          serverImages[p.id] ||
          liveImages[p.id]

        const withRealImages = override
          ? {
              ...p,
              image: override.image,
              gallery: override.gallery,
            }
          : p

        return edits[p.id]
          ? applyEditToPlace(withRealImages, edits[p.id])
          : withRealImages
      })

    return staticMerged.concat(addedPlaces).map((place) => {
      // Replace random stock-photo placeholders with neutral place cards.
      const image = isRandomPlaceholder(place.image)
        ? placeholderImage(place)
        : place.image

      let gallery = (place.gallery || []).filter(
        (item) => !isRandomPlaceholder(item.image)
      )

      if (gallery.length === 0) {
        gallery = [{ image, caption: place.name }]
      }

      const updatedPlace = {
        ...place,
        image,
        gallery,
      }

      // Use curated questions when available; otherwise deduplicate
      // the place's existing quiz questions.
      const base =
        QUIZ_BANK[updatedPlace.id] ||
        dedupeQuiz(updatedPlace.quiz)

      const seen = new Set(
        base.map((q) => normalizeQuestionText(q.question))
      )

      // Append admin-created questions without duplicates.
      const extras = (extraQuestions[updatedPlace.id] || []).filter(
        (q) => {
          const key = normalizeQuestionText(q.question)

          if (seen.has(key)) return false

          seen.add(key)
          return true
        }
      )

      return {
        ...updatedPlace,
        quiz: [...base, ...extras],
      }
    })
  }, [
    removedIds,
    addedPlaces,
    edits,
    extraQuestions,
    serverImages,
    liveImages,
  ])

  const getPlaceById = useCallback(
    (id) => places.find((p) => p.id === id),
    [places]
  )

  return (
    <PlacesContext.Provider
      value={{
        places,
        getPlaceById,
        loaded,
        refresh,
        removedIds,
        addedPlaces,
        edits,
        extraQuestions,
      }}
    >
      {children}
    </PlacesContext.Provider>
  )
}

export function usePlaces() {
  const ctx = useContext(PlacesContext)

  if (!ctx) {
    throw new Error('usePlaces must be used within a PlacesProvider')
  }

  return ctx
}
