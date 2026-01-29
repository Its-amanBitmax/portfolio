const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");
const statesRoutes = require("./routes/statesRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use("/api", apiRoutes);
app.use("/api/states", statesRoutes);
app.use("/api/about", aboutRoutes);

module.exports = app;
