import { MongoClient } from 'mongodb'
import { mongodbstr } from './server_configuration'

export class HuobiDataManager {
    private static client: MongoClient

    static async getMongoClient() {
        if (HuobiDataManager.client && HuobiDataManager.client.isConnected()) return this.client
        await this.connectDB()
        return this.client
    }

    private static connectDB() {
        return new Promise(resolve => {
            MongoClient.connect(mongodbstr, { useUnifiedTopology: true }, (err, client) => {
                this.client = client
                return resolve(client)
            })
        })
    }
}

export async function testMongo() {
    let client = await HuobiDataManager.getMongoClient()
    const db = client.db('HuobiData')
    const coll = db.collection('newcoll')
    coll.insertOne({ name: 'asdasd' }, (err, res) => {
        console.log(res)
    })
}
