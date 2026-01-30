const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");
const statesRoutes = require("./routes/statesRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const serviceRoutes = require('./routes/serviceRoutes');
const skillRoutes = require("./routes/skillRoutes");
const projectRoutes = require("./routes/projectRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const contactInfoRoutes = require("./routes/contactInfoRoutes");
const contactRoutes = require("./routes/contactRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use("/api", apiRoutes);
app.use("/api/states", statesRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/banner", bannerRoutes);
app.use('/api/service', serviceRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/contactinfo", contactInfoRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);


module.exports = app;
