const dotenv = require("dotenv");

if (process.env.NODE_ENV != "production") dotenv.config();

module.exports = process.env;
