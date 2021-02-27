import ncron from 'node-cron'
import proxy from "node-global-proxy";
import { globals, initGlobalStatus } from "./server/global";
import { TCurrencys } from "./server/meta_mongo";
import { countTop1s, getTopIncreases, HuobiDataManager, read_currencys, update_currencys } from "./server/mongo_client";
import { observer } from "./server/observer";
import { retrieveHuobiResponse } from "./server/request";
import { cron_every_10sec } from "./server/schedules";
import { dropCollection, indexOn_content_rate, initDB, initDB_currencys } from "./server/scripts";
import { n_hbsocket, openNodeWebSocket } from "./server/socket_node";
import { allIn, allOut, retrieveHoldings } from "./server/trader";
import { localProxy } from "./shared/constants";
import { added, fixed8, removed, sleep, toSubscriptionStr } from "./shared/helper";
import { ISub } from "./shared/meta";
import { TReq_market_tickers } from "./shared/meta_request";

proxy.setConfig(localProxy)
proxy.start()


initGlobalStatus()
    .then(() => {
        openNodeWebSocket()
        sleep(1000)
            .then(() => {
                getTopIncreases()
            })
        // countTop1s().then(x => console.log(x))
    })

