var express = require('express');
var router = express.Router();
const bcryptjs = require('bcryptjs');
const User = require('../model/video/usermodal');
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', async function (req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        status: false,
        message: 'Invalid Values.!!',
      });
    }

    const hashPass = bcryptjs.hashSync(password, 10);
    const user = new User({ username: req.body.username, password: hashPass });
    const newuser = await user.save();

    res.status(200).json({
      status: true,
      message: 'User Registered.!!',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Error to Sign-Up.!!',
    });
  }
});

router.post('/signin', async function (req, res, next) {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        status: false,
        message: 'Invalid Values.!!',
      });
    }

    const user = await User.findOne({ username: req.body.username });
    const CheckPass = bcryptjs.compareSync(password, user.password);
    if (!CheckPass) {
      return res
        .status(400)
        .json({ status: false, message: 'Invalid Password.!!' });
    }

    const token =  jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    const { password: pass, ...rest } = user._doc;
    res.status(200).json({
      status: true,
      message: 'User SignIn Successfully.!!',
      user: rest,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: 'Error to Sign-Up.!!',
    });
  }
});

module.exports = router;
