const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");


const app = express();
const PORT = process.env.PORT || 3000;
let API_ENV = process.env.ENVIROMENT || "_local";

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  const filePath = path.join(__dirname, "public", "js", "clases", "apiService.js");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error al cargar el archivo");
    }

    const modifiedData = data.replace(/_local/g, `${API_ENV}`);

    fs.writeFile(filePath, modifiedData, 'utf8', (writeErr) => {
      if (writeErr) {
        return res.status(500).send("Error al guardar el archivo modificado");
      }
    });
  });

  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT} en modo ${API_ENV}`);
});
