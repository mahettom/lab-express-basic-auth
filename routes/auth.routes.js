// IMPORT EXPRESS, ROUTER, BCRYPT & GIVE ACCES TO THE USER MODEL
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')


// ROUTE 1 ————————————————> REGISTER PAGE
// ROUTE 2 ————————————————> FORM LISTENER INSIDE THE REGISTER PAGE
// ROUTE 3 ————————————————> LOGIN PAGE
// ROUTE 4 ————————————————> FORM LISTENER INSIDE THE LOGIN PAGE
// ROUTE 5 ————————————————> PROFIL PAGE


// ROUTE TO REGISTER PAGE —————————————————————————————————————————————————————————————————————————————————
router.get('/register', (req, res, next) => {
    try {
        res.render('auth/register')
    } catch (error) {
        next(error)
    }
})



// MANAGE THE REGISTER FORM / MAKE SURE THAT THE CONDITIONS ARE RESPECTED ——————————————————————————————————
router.post('/register', async (req, res) => {
    const { username, password } = req.body

    try {
        // MAKE SURE USER PROVIDE TEXT INTO INPUT
        if (!username || !password) {
            res.render('auth/register', {
                errorMessage: 'you fill all the fields'
            })
        }
        // MAKE SURE PASSWORD IS LONG ENOUGH
        if (password.length < 3) {
            res.render('auth/register', {
                errorMessage: 'your password have at least 4 character'
            })
        }
        // MAKE SURE USER DON'T HAVE A ACCOUNT ALREADY
        const findUser = await User.findOne({ username: username })
        if (findUser) {
            res.render('auth/register', {
                errorMessage: "you don't already have an account"
            })
        }
        // ELSE, IF IT PASS ALL THE CONDITION DO THE CODE BELOW

        // ENCRYPT PASSWORD AND ASSIGN IT TO THE USER MODEL
        const salt = await bcrypt.genSalt(12)
        const hashPassword = await bcrypt.hash(password, salt)
        const accountToCreate = {
            username,
            password: hashPassword,
        }
        // ADD THIS USER MODEL TO THE DATABASE
        const mongoUser = await User.create(accountToCreate)
        console.log(mongoUser)
        res.redirect('/auth/login')

    } catch (error) {
        next(error)
    }
})


// ROUTE TO LOGIN PAGE ———————————————————————————————————————————————————————————————————————————————————
router.get('/login', (req, res, next) => {
    res.render('auth/login')
})


// MANAGE THE LOGIN FORM / MAKE SURE IT MATCH THE REQUIRE CONDITION ——————————————————————————————————————
router.post('/login', async (req, res, next) => {
    try {

        const { username, password } = req.body

        if (!username || !password) {
            res.rend('auth/login', {
                errorMessage: 'you fill all the fields'
            })
        }

        // FIND A USER WHO HAS THE SAME USERNAME
        const userFind = await User.findOne(
            { username },
            { username: 1, password: 1 }
        )
        // IF NOT FIND RENDER LOGIN PAGE WITH INDICATION FOR USER
        if (!userFind) {
            res.render('auth/login', {
                errorMessage: 'there is an account with this username'
            })
        }

        // IF FIND, CHECK IF IT'S THE PASSWORD IS CORRECT
        const passwordIsCorrect = await bcrypt.compare(password, userFind.password)

        if (!passwordIsCorrect) {
            res.render('auth/login', {
                errorMessage: 'enter the correct password'
            })
        }

        // OK SO THIS ONE, I DON'T UNDERSTAND BUT SHE SEEM IMPORTANT
        req.session.currentUser = foundUser

        res.redirect('/profil')

    } catch (error) {
        next(error)
    }
})


// CREATE THE ROUTE FOR THE PROFIL PAGE —————————————————————————————————————————————————————————————————————
router.get('/profil', (req, res, next) => {
    try {
        res.render('auth/profil')
    } catch (error) {
        next(error)
    }
})


module.exports = router