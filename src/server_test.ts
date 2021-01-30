// import { loop_price_queue } from "./test/test_price_queue";

import proxy from "node-global-proxy";
import { globals, initGlobalStatus } from "./server/global";
import { TCurrencys } from "./server/meta_mongo";
import { HuobiDataManager, read_allCurrencys, read_currencys } from "./server/mongo_client";
import { retrieveHuobiResponse } from "./server/request";
import { dropCollection, initDB } from "./server/scripts";
import { allIn, retrieveHoldings } from "./server/trader";
import { localProxy } from "./shared/constants";
import { added, removed, sleep } from "./shared/helper";
import { TReq_market_tickers } from "./shared/meta_request";

// proxy.setConfig(localProxy)
// proxy.start()

// initGlobalStatus()
//     .then(() => {
//         console.log(globals.currencys)
//         console.log(globals.allCurrencys)
//     })
