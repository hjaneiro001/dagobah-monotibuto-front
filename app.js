// const express = require("express");
// const path = require("path");
// const cors = require("cors")

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Servir archivos estáticos desde la carpeta "public"
// app.use(express.static(path.join(__dirname, "public")));
// app.use(cors({
//   origin: "http://localhost:5000",  // Cambia aquí si tu backend está en otro puerto
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para cualquier origen (ajústalo si es necesario)
app.use(cors());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
