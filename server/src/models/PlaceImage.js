import mongoose from 'mongoose'

// The real photos found for one built-in place (hero + gallery), looked up
// from Wikipedia by server/src/utils/placeImageSync.js and served to every
// client from GET /api/places/images. Stored so the lookup happens once per
// place, not once per visitor.
const placeImageSchema = new mongoose.Schema(
  {
    placeId: { type: String, required: true, unique: true, index: true },
    // The Wikipedia article the hero image came from; if the topic list is
    // later corrected, the mismatch tells the sync to look the place up again.
    topicTitle: { type: String, default: '' },
    image: { type: String, required: true },
    gallery: {
      type: [{ image: { type: String, required: true }, caption: { type: String, default: '' }, _id: false }],
      default: [],
    },
    fetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
)

export default mongoose.model('PlaceImage', placeImageSchema)
