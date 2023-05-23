const express = require("express");
const app = express();
const http = require("http");
const PORT = process.env.GATEWAY_PORT || 8080;

app.use(express.json());

// Tests the connection to the "Conference Store" service
app.get("/test/db", async (req, res) => {
  try {
    const response = await fetch(`http://backend_conference_store_1:8083/test`);
    const jsonData = await response.json();
    res.status(200).send(jsonData);
  } catch (err) {
    res.status(504).send("Error 504: Gateway Timeout");
  }
});

app.get("/test", (req, res) => {
  res.status(200).send({ message: "hello!" });
});

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT}`));
