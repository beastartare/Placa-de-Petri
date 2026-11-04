const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
