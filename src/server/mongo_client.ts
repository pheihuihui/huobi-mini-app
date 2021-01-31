import { MongoClient } from 'mongodb'
import { TTrade } from '../shared/meta_request'
import { globals } from './global'
import { TCurrencys, TModel, TTops } from './meta_mongo'

const mongoDbName = 'HuobiData'
const mongoCollName = 'HuobiColl'

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
                console.log('connnected')
                this.client = client
                return resolve(client)
            })
        })
    }
}

export async function read_currencys() {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TModel<'currencys'>>(mongoCollName)
    let dt = await coll.findOne({ type: 'currencys' }, { sort: { timestamp: -1 } })
    globals.currencys = dt?.content.all_currencys ?? []
    globals.currencysCount = dt?.content.length ?? 0
}

export async function update_currencys(data: TCurrencys) {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TModel<'currencys'>>(mongoCollName)
    await coll.insertOne({
        timestamp: Date.now(),
        type: 'currencys',
        content: {
            all_currencys: data.all_currencys,
            removed_currencys: data.removed_currencys,
            added_currencys: data.added_currencys,
            length: data.all_currencys.length
        }
    })
}

export async function write_logs(data: string) {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TModel<'info'>>(mongoCollName)
    await coll.insertOne({
        timestamp: Date.now(),
        type: 'info',
        content: {
            text: data
        }
    })
}

export async function write_trading_log(data: string, tradeType: TTrade) {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TModel<'log'>>(mongoCollName)
    await coll.insertOne({
        timestamp: Date.now(),
        type: 'log',
        content: {
            trade_type: tradeType,
            symbol: data,
            amount: 1,
            price: 1
        }
    })
}

export async function write_tops(tops: TTops) {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TModel<'tops'>>(mongoCollName)
    await coll.insertOne({
        timestamp: Date.now(),
        type: 'tops',
        content: tops
    })
}