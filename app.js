const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.ENVIROMENT;

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  const filePath = path.join(__dirname, "public", "js", "clases", "apiService.js");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error al cargar el archivo");
    }
    const apiUrl = process.env.API_URL || `http://localhost:${PORT}`;
    
  });
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT} en modo ${ENV}`);
});
