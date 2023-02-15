const router = require("express").Router();



// GET TO HOMEPAGE
router.get("/", (req, res, next) => {
  res.render("index");
});


// router.use('/', require('./auth.routes'))
router.use('/auth', require('./auth.routes'))


module.exports = router;