// import { loop_price_queue } from "./test/test_price_queue";

import proxy from "node-global-proxy";
import { init_allCurrencys, read_allCurrencys } from "./utilities/server/mongo_client";
import { createNewRestRequestFromNode } from "./utilities/server/request";
import { localProxy } from "./utilities/shared/constants";
import { added, removed } from "./utilities/shared/helper";

// loop_price_queue()

// proxy.setConfig(localProxy)
// proxy.start()

// createNewRestRequestFromNode('/v1/common/currencys', {})
//     .then(x => x.json())
//     .then(x => console.log(x.data.length))

// let x = 0
// while(x < 10){
//     write_allCurrencys({ts: Date.now(), length: 10, currencys: ['aa', 'ccc']})
//     x += 1
//     console.log(x)
// }

// read_allCurrencys()
// init_allCurrencys()

console.log(removed([1, 2, 3], [2, 3, 4]))