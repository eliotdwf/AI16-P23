var mysql = require("mysql");
var pool = mysql.createPool({
    host: "tuxa.sme.utc", //ou localhost
    user: "ai16p008",
    password: "sBV5zNdx0THD",
    database: "ai16p008"
});
module.exports = pool;