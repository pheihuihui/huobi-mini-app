// import { loop_price_queue } from "./test/test_price_queue";

import proxy from "node-global-proxy";
import { globals, initGlobalStatus } from "./server/global";
import { TCurrencys } from "./server/meta_mongo";
import { HuobiDataManager, read_currencys, update_currencys } from "./server/mongo_client";
import { retrieveHuobiResponse } from "./server/request";
import { dropCollection, initDB, initDB_currencys } from "./server/scripts";
import { allIn, retrieveHoldings } from "./server/trader";
import { localProxy } from "./shared/constants";
import { added, removed, sleep } from "./shared/helper";
import { TReq_market_tickers } from "./shared/meta_request";

proxy.setConfig(localProxy)
proxy.start()


initGlobalStatus()
    .then(() => {
        read_currencys()
            .then(() => {
                console.log(globals.currencys)
                console.log(globals.currencysCount)
            })
    })

// retrieveHuobiResponse('/v1/common/currencys', {})
//     .then(x => {
//         let pre = {} as TCurrencys
//         pre.added_currencys = []
//         pre.removed_currencys = []
//         pre.all_currencys = x.data
//         pre.length = x.data.length
//         update_currencys(pre)
//     })
