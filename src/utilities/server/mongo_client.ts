import { MongoClient } from 'mongodb'
import { mongoCollectionName, mongoDbName } from '../shared/constants'
import { TPromiseRespV1, TRespV1, TResp_v1_common_currencys } from '../shared/meta_response'
import { globalStatus } from './global'
import { TAllCurrencys } from './meta_mongo'
import { createNewRestRequestFromNode } from './request'
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

export async function read_allCurrencys() {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TAllCurrencys>(mongoCollectionName)
    let dt = await coll.findOne({}, { sort: { ts: -1 } })
    globalStatus.currencys = dt?.currencys ?? []
    globalStatus.currencysCount = dt?.length ?? 0
    client.close()
}

export async function init_allCurrencys() {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TAllCurrencys>(mongoCollectionName)
    coll.createIndex({ ts: 1 })
    await createNewRestRequestFromNode('/v1/common/currencys', {})
        .then(x => x.json() as TPromiseRespV1<TResp_v1_common_currencys>)
        .then(x => {
            coll.insertOne({
                ts: Date.now(),
                length: x.data.length,
                currencys: x.data
            })
        })
    client.close()
}

export async function update_allCurrencys(data: TAllCurrencys) {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection<TAllCurrencys>(mongoCollectionName)
    await coll.insertOne({
        ts: data.ts,
        length: data.currencys.length,
        currencys: data.currencys
    })
    client.close()
}

export async function write_logs(data: string) {
    let client = await HuobiDataManager.getMongoClient()
    let db = client.db(mongoDbName)
    let coll = db.collection('logs')
    await coll.insertOne({
        ts: Date.now(),
        text: data
    })
}