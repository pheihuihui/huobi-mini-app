import proxy from "node-global-proxy";
import { mongodbstr } from "./utilities/server/server_configuration";
import { testMongo } from "./utilities/server/mongo_client";
import { openNodeWebSocket } from "./utilities/server/socket_node";
import { localProxy } from "./utilities/shared/constants";
import { added, removed } from "./utilities/shared/helper";
import { PriceQueue } from "./utilities/shared/price_queue";
import { retrievedSecret } from "./utilities/server/key_vault";
import { to64_node } from "./utilities/server/helper_node";
import { createNewRestRequestFromNode } from "./utilities/server/request";

proxy.setConfig(localProxy)
proxy.start()

// openNodeWebSocket()
// testMongo()

// let secr = retrievedSecret('huobi-read-access').then(x => console.log(x.value?.length))

// console.log(to64_node('222', 'ddd'))

// createNewRestRequestFromNode('/v1/account/accounts', {}).then(x => x.json()).then(x => console.log(x))