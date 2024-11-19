const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator')
const userModel = require('../models/user.models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/register', (req, res) => {
    res.render("register")
})

router.post('/register',
    body('email').trim().isEmail().isLength({ min: 13 }),
    body('password').trim().isLength({ min: 5 }),
    body('username').trim().isLength({ min: 3 }),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid Data"
            })
        }

        const { username, email, password } = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        const data = await userModel.create({
            username,
            email,
            password: hashPassword
        })

        // await res.status(200).json({
        //     newUser: data,
        //     message: "New User Registered Successfully"
        // })
        res.redirect('/user/login')
    }
)

router.get('/login', (req, res) => {
    res.render("login")
})

router.post('/login',
    body('username').trim().isLength({ min: 3 }),
    body('password').trim().isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array(),
                message: "Invalid Data"
            })
        }

        const { username, password } = req.body

        const user = await userModel.findOne({ username: username });

        if (!user) {

            return res.status(400).json({
                message: "username or password is incorrect"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "username or password is incorrect"
            })
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            username: user.username
        },
            process.env.JWT_SECRET,
        )


        res.cookie('token', token)

        res.redirect('/home')

    }
)


router.get('/logout', (req, res) => {
    res.clearCookie('token')
    
    res.redirect('/user/login')
})





module.exports = router