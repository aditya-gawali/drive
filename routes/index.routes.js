const express = require('express')
const router = express.Router()
const cloudinary = require('../config/cloudinary')
const upload = require('../config/multer')
const fileModel = require("../models/files.models")

const authMiddleware = require('../middlewares/auth')

router.get('/home', authMiddleware, async (req, res) => {

    const userFiles = await fileModel.find({ user: req.user.userId })

    res.render('home', {
        userName: req.user.username, files: userFiles,
    })
})

router.post('/upload-file', authMiddleware, upload.array('file', 10), async (req, res) => {
    try {

        const files = []
        req.files.map(file => (
            files.push({
                path: file.path, // Store relative or absolute path
                originalname: file.originalname,
                publicID: file.filename,
                size: file.size,
                user: req.user.userId
            })
        ));
        const options = { ordered: true };
        const result = await fileModel.insertMany(files, options);

        // res.status(200).json(result);
        res.redirect('/home')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to upload file', error });
    }
})
// router.post('/upload-file', authMiddleware, upload.single('file'), async (req, res) => {
//     try {

//         const newFile = await fileModel.create({
//             path: req.file.path,
//             originalname: req.file.originalname,
//             user: req.user.userId
//         })
//         res.status(200).json(newFile);
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ message: 'Failed to upload file', error });
//     }
// })

router.get('/download/:path', authMiddleware, async (req, res) => {
    const loggedInUserId = req.user.userId;

    const path = req.params.path;

    const file = await fileModel.findOne({
        user: loggedInUserId,
        path: path
    })

    if (!file) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const fileUrl = file.path;

    // Set response headers for download
    res.setHeader('Content-Disposition', `attachment; filename=${file.originalname}.jpg`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Fetch the file from Cloudinary
    const response = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'stream',  // Ensures response is in stream format
    });

    // Pipe the Cloudinary stream to the response for direct download
    response.data.pipe(res);
})


router.get('/delete-file/:id', authMiddleware, async (req, res) => {
    const id = req.params.id

    const file = await fileModel.findOneAndDelete({ _id: id, user: req.user.userId });

    const result = await cloudinary.uploader.destroy(file.publicID)
    
    if(result.result === "ok") res.redirect('/home')
})
module.exports = router