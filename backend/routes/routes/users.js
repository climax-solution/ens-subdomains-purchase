var express = require('express');
const { check_zero, validate_address } = require('../../helper');
var router = express.Router();
var User = require('../../models/users');
/* GET users listing. */
router.get('/get-list', async function(req, res, next) {
  try {
    const list = await User.find();
    res.json(200).json({
      list
    });
  } catch(err) {
    res.json(400).json({ list: [] });
  }
});

router.post('/create-new-user', async function(req, res) {
  try {
    const { address } = req.body;
    if (!address) throw Error('address is not definded');
    
    const isZero = check_zero(address);
    if (isZero) throw Error('not support 0x0');
    const isAddress = validate_address(address);
    if (!isAddress) throw Error('only support address');
    
    const exist = await User.findOne({ address });
    if (exist) throw Error("already existing user");

    const newuser = new User({
      address
    });
    await newuser.save();
    res.status(200).json({
      success: true
    });
  } catch(err) {
    console.log(err);
    res.status(400).json({
      error: err?.message
    })
  }
})
module.exports = router;
