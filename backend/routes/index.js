var express = require('express');
const app = express();
var router = express.Router();
var users = require("./routes/users");
var reviews = require("./routes/reviews");

router.use('/users', users);
router.use('/reviews', reviews);

module.exports = router;
