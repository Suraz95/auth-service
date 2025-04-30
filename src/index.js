const dotenv = require("dotenv");
const connection = require("./db/index.js");
const { app } = require("./app.js");

dotenv.config({
  path: "./.env",
});

connection()
  .then(() => {
    app.listen(process.env.PORT || 5001);
  })
  .catch((error) => {
    console.log("you got a error while connecting the mongodb", error);
  });
