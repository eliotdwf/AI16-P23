let mysql = require("mysql");
let pool = mysql.createPool({
    host: "tuxa.sme.utc",
    user: "ai16p008",
    password: "sBV5zNdx0THD",
    database: "ai16p008"
});
/*let pool = mysql.createPool({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database: "ai16_p23"
})*/
module.exports = pool;