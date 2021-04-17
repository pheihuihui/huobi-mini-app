(() => {
  // src/shared/helper.ts
  var combineUrl = (path, paras) => {
    return path.split("/").map((x) => {
      if (x[0] == ":") {
        let name = x.slice(1);
        if (paras[name]) {
          return paras[name];
        } else {
          return "";
        }
      } else {
        return x;
      }
    }).join("/");
  };

  // src/client/client_requests.ts
  var headers = new Headers({
    passwd: localStorage["passwd"] ?? "",
    "Content-Type": "application/json"
  });
  var urlPrefix = localStorage["urlPrefix"] ?? "";
  var reqParas_GET = {
    method: "GET",
    mode: "cors",
    headers
  };
  var reqParas_POST = (bd) => {
    return {
      method: "POST",
      mode: "cors",
      headers,
      body: JSON.stringify(bd)
    };
  };
  async function sendRequest(name, paras) {
    let promise;
    let url;
    if (paras.paths) {
      url = combineUrl(name, paras.paths);
    } else {
      url = name;
    }
    if (paras.type == "GET") {
      promise = fetch(urlPrefix + name, reqParas_GET);
    }
    if (paras.type == "POST") {
      if (paras.body) {
        promise = fetch(urlPrefix + name, reqParas_POST(paras.body));
      } else {
        promise = fetch(urlPrefix + name);
      }
    }
    if (promise) {
      let pr = await promise;
      let rs = await pr.json();
      return rs;
    }
  }
  function allIn(cur) {
    sendRequest("/buy", {type: "POST", body: {coin: cur}}).then((x) => console.log(x));
  }
  function allOut(cur) {
    sendRequest("/sell", {type: "POST", body: {coin: cur}}).then((x) => console.log(x));
  }
  function testConnection() {
    sendRequest("/query/account/status", {type: "GET"}).then((x) => console.log(x));
  }
  function attachFunctions2Window() {
    window.allIn = allIn;
    window.allOut = allOut;
    window.testConnection = testConnection;
  }

  // src/client/client_credentials.ts
  var CUSTOMCONNSTR_cosmosstring = localStorage.getItem("CUSTOMCONNSTR_cosmosstring") ?? "xxx";
  var huobi_read_access = localStorage.getItem("huobi_read_access") ?? "xxx";
  var huobi_read_secret = localStorage.getItem("huobi_read_secret") ?? "xxx";
  var huobi_trade_access = localStorage.getItem("huobi_trade_access") ?? "xxx";
  var huobi_trade_secret = localStorage.getItem("huobi_trade_secret") ?? "xxx";

  // src/client/client_utilities.ts
  var urlPrefix_cloud = "https://cryptowatcher.azurewebsites.net";
  var urlPrefix_local = "http://127.0.0.1:3000";
  function switchTo(env) {
    if (env == "cloud") {
      localStorage["urlPrefix"] = urlPrefix_cloud;
    }
    if (env == "local") {
      localStorage["urlPrefix"] = urlPrefix_local;
    }
  }
  function setEnv() {
    window.switchTo = switchTo;
  }

  // src/client.ts
  setEnv();
  attachFunctions2Window();
})();
