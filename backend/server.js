const express = require("express");
const path = require("path");
const jogoRoutes = require("./routes/jogo");

const app = express();
const PORT = 3000;

const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.json());
app.use("/api", jogoRoutes);

app.use(express.static(frontendPath));

app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});