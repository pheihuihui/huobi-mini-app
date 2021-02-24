import { Cursor, FilterQuery, MongoClient } from 'mongodb'
import { TTrade } from '../shared/meta_request'
import { globals } from './global'
import { TCurrencys, TIncrease, TModel, TModelName, TTops } from './meta_mongo'

const mongoDbName = 'HuobiData'
const mongoCollName = 'HuobiColl'

export class HuobiDataManager {
    private static client: MongoClient

    static async getMongoClient() {
        if (HuobiDataManager.client && HuobiDataManager.client.isConnected()) return this.client
        // await this.connectDB()
        let cli = await MongoClient.connect(globals.secrets.cosmosConnStr, { useUnifiedTopology: true })
        this.client = cli
        return this.client
    }
}

async function getCollection<T extends TModelName>(name: T) {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TModel<T>>(mongoCollName)
    return coll
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

export async function write_top1_async(top: TIncrease) {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TModel<'top1'>>(mongoCollName)
    await coll.insertOne({
        timestamp: Date.now(),
        type: 'top1',
        content: top
    })
}

export function write_top1(top: TIncrease) {
    HuobiDataManager.getMongoClient()
        .then(client => {
            let db = client.db(mongoDbName)
            let coll = db.collection<TModel<'top1'>>(mongoCollName)
            coll.insertOne({
                timestamp: Date.now(),
                type: 'top1',
                content: top
            }).then(res => {
                console.log(res.result)
            })
        })
}

export async function getTopIncreases(symbol?: string) {
    let coll = await getCollection('top1')
    let curs: Cursor<TModel<'top1'>> = coll.find({
        type: 'top1',
        'content.sharp': true
    }).limit(10)

    curs.forEach(v => {
        console.log(v)
    })
}

export async function countTop1s() {
    let coll = await getCollection('top1')
    let curs: Cursor<TModel<'top1'>> = coll.find({
        type: 'top1',
        'content.sharp': false
    })
    return await curs.count()
}