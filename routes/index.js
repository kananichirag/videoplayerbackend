var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
let model = require('../model/video/video');
/* GET home page. */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // File naming scheme
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post(
  '/video_uplode',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  async function (req, res, next) {
    console.log(req.body);
    try {
      // Check if both image and video files are uploaded
      if (!req.files || !req.files['image'] || !req.files['video']) {
        return res
          .status(400)
          .json({ message: 'Please upload both an image and a video.' });
      }

      // Extract filenames of the uploaded image and video files
      const uploadedImage = req.files['image'][0].filename;
      const uploadedVideo = req.files['video'][0].filename;

      // Create a new model instance with image and video filenames
      let result = await model.create({
        image: uploadedImage,
        video: uploadedVideo,
        name: req.body.name,
        // Add other fields from req.body as needed
      });

      let url = 'https://goog.com/' + result._id;

      return res.status(201).json({
        status: true,
        message: 'File uploaded successfully.',
        url,
        result,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: 'Oops! There was an error.',
      });
    }
  }
);

// router.post('/video_uplode', upload.array('files',2), async function (req, res, next) {
//   try {
//     console.log(req.body.image);
//     req?.files?.map((ele) => {
//       if (ele.fieldname == 'video' && ele.fieldname == 'image') {
//         req.body.video = ele.filename;
//         req.body.image = ele.image;
//       }
//     });
//     let result = await model.create(req.body);
//     let url = 'https://goog.com/' + result._id;
//     return res.status(201).json({
//       status: true,
//       message: 'File Upload successfully.!!!',
//       url,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       status: false,
//       message: 'opps there is an error',
//     });
//   }
// });
router.get('/list', async function (req, res, next) {
  try {
    let result = await model.find({});
    return res.status(200).json({
      status: true,
      message: 'success',
      result,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'opps there is an error',
      result,
    });
  }
});

router.get('/post/:id', async function (req, res, next) {
  try {
    let result = await model.findById(req.params.id);
    return res.status(200).json({
      status: true,
      message: 'success',
      result,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'opps there is an error',
      result,
    });
  }
});

// router.get('/video_get', async function (req, res, next) {
//   try {
//     let result = await model.find({ _id: req?.query?.id });

//     return res.status(200).json({
//       status: true,
//       message: 'success',
//       result,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: 'opps there is an error',
//       result,
//     });
//   }
// });
module.exports = router;
