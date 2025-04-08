require("dotenv").config();
const port = process.env.PORT || 3010;
const cors = require("cors");
const express = require("express");
const router = require("./src/routes/user");
const dbconnection = require("./src/general/Connection");
const bodyParser = require("body-parser");
const bk = require("./src/routes/booker");
const admin = require("./src/routes/admin");
const veftok = require("./src/middleware/decoder");
// sample

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use("/users", router);
app.use("/book", bk);
app.use("/admin", admin);
dbconnection();
app.listen(port, () => {
  console.log("Serve list");
});

// sample22334
