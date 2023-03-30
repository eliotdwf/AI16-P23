var mysql = require("mysql");
/*var pool = mysql.createPool({
    host: "tuxa.sme.utc", //ou localhost
    user: "ai16p008",
    password: "sBV5zNdx0THD",
    database: "ai16p008"
});*/
var pool = mysql.createPool({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database: "ai16_p23"
})
module.exports = pool;