const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.ENVIROMENT;

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, ENV,() => {
  console.log(`Servidor corriendo en http://localhost:${PORT} ${ENV}`);
});
