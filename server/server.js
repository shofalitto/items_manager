const path = require("path");
const Joi = require("joi");
const express = require("express");


const index = require("./routes/index");
const items = require("./routes/items");

const app = express();
app.use(express.json());



app.get("/getData", (req, res) => {
  res.json({
    statusCode: 200,
    statusMessage: "SUCCESS",
  });
});


// View Engine setup
app.set("views", path.join(__dirname, "views"));
app.set("views engine", "ejs");
app.engine("html", require("ejs").renderFile);

// Set Static Folder
app.use(express.static(path.join(__dirname, "client")));

// Body Parser MW
app.use(express.urlencoded({ extended: false }));

app.use("/", index);
app.use("/api", items);

// Use env.port if it's configured otherwise use port=3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}... `));
