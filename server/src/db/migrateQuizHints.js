import User from '../models/User.js'

// quizHints used to store a plain count per place ({ colosseum: 1 }); it now
// stores the keys of the questions a hint was spent on ({ colosseum: ['...'] }).
// A leftover number makes $addToSet fail, so convert any old counts into the
// same number of placeholder keys -- hints already spent stay spent. Only
// touches users that still have an old-style value, so after the first run
// this is a single cheap query.
export async function migrateQuizHints() {
  const users = await User.collection
    .find({ quizHints: { $exists: true } }, { projection: { quizHints: 1 } })
    .toArray()

  let migrated = 0
  for (const u of users) {
    const set = {}
    for (const [placeId, value] of Object.entries(u.quizHints || {})) {
      if (Array.isArray(value)) continue
      const count = Math.max(0, Math.min(Number(value) || 0, 3))
      set[`quizHints.${placeId}`] = Array.from({ length: count }, (_, i) => `legacy-${i + 1}`)
    }
    if (Object.keys(set).length > 0) {
      await User.collection.updateOne({ _id: u._id }, { $set: set })
      migrated += 1
    }
  }
  if (migrated > 0) console.log(`✔ Migrated old quiz hint counts for ${migrated} user(s)`)
}
