import 'dotenv/config'
import { connectDB } from './index.js'
import User from '../models/User.js'

async function main() {
  await connectDB()
  const count = await User.countDocuments()
  console.log('✔ Connected to MongoDB')
  console.log(`  existing users: ${count}`)
  console.log(`  database: ${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chronomap'}`)
  process.exit(0)
}

main().catch((err) => {
  console.error('DB check failed:', err.message)
  process.exit(1)
})
