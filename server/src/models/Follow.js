import mongoose from 'mongoose'

// One document per "A follows B" relationship. Kept in its own collection
// (rather than as arrays on User) so following/unfollowing is a single small
// write, and follower lists and counts can be queried without loading whole
// user documents. The unique index makes following idempotent -- a double
// click, or two tabs, can never create a duplicate edge.
const followSchema = new mongoose.Schema(
  {
    follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
)

followSchema.index({ follower: 1, following: 1 }, { unique: true })
// "Who follows X?" and counting X's followers.
followSchema.index({ following: 1, createdAt: -1 })
followSchema.index({ follower: 1, createdAt: -1 })

export default mongoose.model('Follow', followSchema)
