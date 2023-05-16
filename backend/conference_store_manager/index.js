const express = require("express");
const app = express();

const PORT = process.env.CONF_DB_MGR_PORT || 8083;

// MYSQL_PORT should always be 3306, because even though the port might be mapped
//   to something else locally, it is still listening on port 3306 internally
//   within the container that the mysql server is running on
const MYSQL_PORT = 3306;

var mysql = require("mysql");

app.get("/test", (req, res) => {
  var con = mysql.createConnection({
    host: "backend_conf_db_1", // This should be the name of the service from the docker-compose file
    database: "conferences", // The database to connect to
    port: MYSQL_PORT, // This should be 3306, see above
    user: "root",
    password: "root",
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to Conferences Database");
  });

  res.status(200).send({ message: "hello from database manager!" });
});

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT}`));
