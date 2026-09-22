import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chronomap'

mongoose.set('strictQuery', true)

export async function connectDB() {
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message)
  })

  try {
    await mongoose.connect(MONGODB_URI)
    console.log(`✔ MongoDB connected -> ${mongoose.connection.name}`)
  } catch (err) {
    console.error('✘ Could not connect to MongoDB:', err.message)
    console.error(`  Tried: ${MONGODB_URI}`)
    console.error('  Is mongod running locally, or is MONGODB_URI set correctly in server/.env?')
    process.exit(1)
  }
}

export default mongoose
