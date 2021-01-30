import { MongoClient } from 'mongodb'
import { TTrade } from '../shared/meta_request'
import { globals } from './global'
import { TAllCurrencys, TCurrencys } from './meta_mongo'
import { retrieveHuobiResponse } from './request'

const mongoDbName = 'HuobiData'
const mongo_coll_name_currencys = 'coll_currencys'
const mongo_coll_name_all_currencys = 'coll_all_currencys'
const mongo_coll_logs = 'coll_logs'
const mongo_coll_trading_logs = 'coll_trading_logs'

export class HuobiDataManager {
    private static client: MongoClient

    static async getMongoClient() {
        if (HuobiDataManager.client && HuobiDataManager.client.isConnected()) return this.client
        await this.connectDB()
        return this.client
    }

    private static async connectDB() {
        return new Promise(resolve => {
            MongoClient.connect(globals.secrets.cosmosConnStr, { useUnifiedTopology: true }, (err, client) => {
                this.client = client
                return resolve(client)
            })
        })
    }
}

export async function read_allCurrencys() {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TAllCurrencys>(mongo_coll_name_all_currencys)
    let dt = await coll.findOne({}, { sort: { _id: -1 } })
    globals.allCurrencys = dt?.allCurrencys ?? []
    globals.allCurrencysCount = dt?.count ?? 0
}

export async function read_currencys() {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TCurrencys>(mongo_coll_name_currencys)
    let dt = await coll.findOne({}, { sort: { ts: -1 } })
    globals.currencys = dt?.currencys ?? []
    globals.currencysCount = dt?.length ?? 0
}

export async function update_currencys(data: TCurrencys) {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TCurrencys>(mongo_coll_name_currencys)
    await coll.insertOne({
        ts: data.ts,
        length: data.currencys.length,
        currencys: data.currencys,
        added: data.added,
        removed: data.removed
    })
}

export async function update_allCurrencys(curs: string[]) {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TAllCurrencys>(mongo_coll_name_all_currencys)
    coll.updateOne({}, {
        $set: {
            count: curs.length,
            allCurrencys: curs
        }
    })
}

export async function write_logs(data: string) {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection(mongo_coll_logs)
    await coll.insertOne({
        ts: Date.now(),
        text: data
    })
}

export async function write_trading_log(data: string, tradeType: TTrade) {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection(mongo_coll_trading_logs)
    await coll.insertOne({
        ts: Date.now(),
        text: data,
        type: tradeType
    })
}
