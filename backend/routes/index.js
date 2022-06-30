var express = require('express');
const app = express();
var router = express.Router();
var users = require("./routes/users");

router.use('/users', users);

module.exports = router;
