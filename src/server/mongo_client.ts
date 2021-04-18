import { Cursor, FilterQuery, MongoClient } from 'mongodb'
import { TTrade } from '../shared/meta_request'
import { globals } from './global'
import { IModels, TModel, TModelName } from './meta_mongo'

const mongoDbName = 'HuobiData'
const mongoCollName = 'HuobiColl'

class HuobiDataManager {
    private static client: MongoClient
    static async getMongoClient() {
        if (HuobiDataManager.client && HuobiDataManager.client.isConnected()) return this.client
        // await this.connectDB()
        let cli = await MongoClient.connect(globals.secrets.cosmosConnStr, { useUnifiedTopology: true })
        this.client = cli
        return this.client
    }
}

async function getCollection<T extends TModelName>(type: T) {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TModel<T>>(mongoCollName)
    return coll
}

export async function insertNewItem<T extends TModelName>(type: T, para: IModels[T]) {
    let coll = await getCollection(type)
    let item: TModel<T> = {
        timestamp: Date.now(),
        type: type,
        content: para
    }
    await coll.insertOne(item)
        .then(res => {
            console.log(res.result)
        })
}

export async function readItems<T extends TModelName>(type: T) {
    let coll = await getCollection(type)
    let res = await coll.find({ type: type } as FilterQuery<T>).limit(10)
    let ret = await res.toArray()
    return ret
}

export async function readOneItem<T extends TModelName>(type: T) {
    let coll = await getCollection(type)
    let res = await coll.findOne({ type: type } as FilterQuery<T>, { sort: { timestamp: -1 } })
    return res?.content
}