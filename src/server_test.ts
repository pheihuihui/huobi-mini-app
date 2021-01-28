// import { loop_price_queue } from "./test/test_price_queue";

import proxy from "node-global-proxy";
import { globals, initGlobalStatus } from "./utilities/server/global";
import { TCurrencys } from "./utilities/server/meta_mongo";
import { HuobiDataManager, read_allCurrencys, read_currencys } from "./utilities/server/mongo_client";
import { retrieveHuobiResponse } from "./utilities/server/request";
import { dropCollection, initDB } from "./utilities/server/scripts";
import { allIn, retrieveHoldings } from "./utilities/server/trader";
import { localProxy } from "./utilities/shared/constants";
import { added, removed, sleep } from "./utilities/shared/helper";
import { TReq_market_tickers } from "./utilities/shared/meta_request";

// proxy.setConfig(localProxy)
// proxy.start()

// initGlobalStatus()
//     .then(() => {
//         console.log(globals.currencys)
//         console.log(globals.allCurrencys)
//     })
