const express = require("express");
const app = express();

// Allows the parsing of application/json requests
app.use(express.json());

const PORT = process.env.CONF_DB_MGR_PORT || 8083;

// MYSQL_PORT should always be 3306, because even though the port might be mapped
//   to something else locally, it is still listening on port 3306 internally
//   within the container that the mysql server is running on
const MYSQL_PORT = 3306;

var mysql = require("mysql");

// set connection parameters for mysql
var con = mysql.createConnection({
  host: "backend_conf_db_1", // This should be the name of the service from the docker-compose file
  database: "conferences", // The database to connect to
  port: MYSQL_PORT, // This should be 3306, see above
  user: "root",
  password: "root",
});

// Waits 2 seconds after launching to give a chance for MySQL Service to launch
setTimeout(() => {
  con.connect(function (err) {
    if (err) throw err; // Throws an error if it can't connect
    console.log("Connected to Conferences Database"); // prints this if it can
  });
}, 2000);

// Tests connection to database
app.get("/test", (req, res) => {
  res.status(200).send({ message: "hello from database manager!" }); // successful connection returns a 200
});

// Adds conferences to the database
app.post("/add_conferences", (req, res) => {
  // Connection to database was already initiated.

  // Stores the values from the request formatted for the sql query
  let values = [];

  // Used to verify that there aren't duplicates being sent
  const name_map = new Map();

  // Loops over every conference sent and formats the data to store in values
  req.body.conferences.forEach((item) => {
    // checks if a conference of the same name is already in the list
    if (name_map.get(item["name"]) != undefined) return;

    values.push([
      item["name"],
      item["link"],
      item["location"],
      item["deadline"],
    ]);

    // adds the conference name to the map to mark it as added to avoid duplicates
    name_map.set(item["name"], 1);
  });

  // Inserts items into the conf table
  var sql = "INSERT INTO conf (name, link, location, deadline) VALUES ?";

  // Uses the values formatted earlier to insert multiple items simultaneously
  con.query(sql, [values], (err, result) => {
    if (err) throw err;
    console.log("Inserted entries into database");
  });

  res.status(200).send(req.body);
});

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT}`));
