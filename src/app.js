const express = require("express");
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const redirectCheck = require("../utils/redirectCheck");
const { error } = require("console");

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the public folder
const publicDirectoryPath = path.join(__dirname, "../public");
// app.use(express.static(path.join(__dirname, "../public")));
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Redirect Checker",
  });
});

app.post("/redirectCheck", (req, res) => {
  const inputData = req.body.inputData;
  // Process inputData as needed
  if (inputData !== "") {
    console.log("Input Data:", inputData);
    // res.send('Data received');
    redirectCheck(inputData, (error, data) => {
      if (error) {
        console.log(error);
      }
      res.render("redirectResult", { data });
    });
  }
});

app.listen(port, () => {
  console.log("server is listening on port " + port);
});
