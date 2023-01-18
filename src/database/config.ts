import mongoose from 'mongoose'

const dbConnection = async () => {
  try {
    mongoose.set('strictQuery', true)
    await mongoose.connect(String(process.env.MONGODB_ATLAS), {})
    console.log('Database online')
  } catch (error) {
    console.log(error)
    throw new Error('Failed connecting to the database.')
  }
}

export { dbConnection }
