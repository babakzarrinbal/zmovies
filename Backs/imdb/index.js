// require("promise.prototype.finally").shim();

var getMInfo = id =>
  new Promise((resovle, reject) => {
    const http = require("http");
    http
      .get(`http://www.omdbapi.com/?i=${id}&apikey=21a6c919`, resp => {
        let data = "";
        let result;
        resp.on("data", chunk => (data += chunk));
        resp.on("end", () => {
          try {
            result = JSON.parse(data);
          } catch (e) {
            result = data;
          }
          resovle(result);
        });
      })
      .on("error", reject);
  });
let init = () => {
  getMInfo("tt3896198")
    .then(console.log)
    .catch(console.log);
  // .finally(() => console.log(".............................finished"));
};
init();
