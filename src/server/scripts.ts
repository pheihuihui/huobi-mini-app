import { syncBuiltinESMExports } from "module";
import { TAllCurrencys, TCurrencys } from "./meta_mongo";
import { HuobiDataManager, update_currencys } from "./mongo_client";
import { retrieveHuobiResponse } from "./request";

const mongoDbName = 'HuobiData'
const mongo_coll_name_currencys = 'coll_currencys'
const mongo_coll_name_all_currencys = 'coll_all_currencys'
const mongo_coll_logs = 'coll_logs'

export async function initDB() {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll_1 = db.collection<TCurrencys>(mongo_coll_name_currencys)
    let coll_2 = db.collection<TAllCurrencys>(mongo_coll_name_all_currencys)
    coll_1.createIndex({ ts: 1 })
    let resp = await retrieveHuobiResponse('/v1/common/currencys', {})
    await coll_1.insertOne({
        ts: Date.now(),
        length: resp.data.length,
        currencys: resp.data,
        added: [],
        removed: []
    })
    await coll_2.insertOne({
        allCurrencys: resp.data,
        count: resp.data.length
    })
    await client.close()
}

export async function dropCollection(name: string) {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    await db.dropCollection(name)
}