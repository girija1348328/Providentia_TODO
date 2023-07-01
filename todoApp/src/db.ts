import {MongoClient} from 'mongodb'

const {
    MONGO_URI = 'mongodb+srv://disha123:hl6LMcJIED1eCZhr@cluster0.hrerz.mongodb.net/providentia',

}= process.env

export const client = new MongoClient(MONGO_URI)
export const db = client.db()