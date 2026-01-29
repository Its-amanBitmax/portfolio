const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");
const statesRoutes = require("./routes/statesRoutes");
const app = express();

app.use(cors());
app.use(express.json());



app.use("/api", apiRoutes);
app.use("/api/states", statesRoutes);
module.exports = app;
