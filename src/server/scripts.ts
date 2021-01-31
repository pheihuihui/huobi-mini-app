import { TModel } from "./meta_mongo";
import { HuobiDataManager } from "./mongo_client";
import { retrieveHuobiResponse } from "./request";

const mongoDbName = 'HuobiData'
const mongo_coll_name = 'HuobiColl'

export async function initDB() {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TModel<'info'>>(mongo_coll_name)
    coll.createIndex({ timestamp: 1 })
    await coll.insertOne({
        timestamp: Date.now(),
        type: 'info',
        content: {
            text: 'test'
        }
    })
    await client.close()
}

export async function initDB_currencys() {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TModel<'currencys'>>(mongo_coll_name)
    let resp = await retrieveHuobiResponse('/v1/common/currencys', {})
    await coll.insertOne({
        timestamp: Date.now(),
        type: 'currencys',
        content: {
            all_currencys: resp.data,
            length: resp.data.length,
            added_currencys: [],
            removed_currencys: []
        }
    })
    await client.close()
}

export async function dropCollection(name: string) {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    await db.dropCollection(name)
}