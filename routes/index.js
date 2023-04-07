var express = require('express');
var router = express.Router();

const User = require('../model/userSchema');

router.get('/', function (req, res, next) {
  res.render('signup', { title: 'signup' });
});

router.get('/signin', function (req, res, next) {
  res.render('signin', { title: 'signin' });
});


router.post('/signup', function (req, res, next) {

  const { username, password, email } = req.body;

  User.create({ username, password, email })
    .then((userCreated) => {
      res.redirect('/signin');
    })
    .catch((err) => {
      res.send(err)
    });

});

router.post('/signin', function (req, res, next) {

  const { username, password } = req.body;

  User.findOne({ username })
    .then((userFounded) => {
      // res.send('successfull!!');
      if (!userFounded) {
        return res.send("user not found!! <a href='/signin'>back</a>")
      };
      if (password !== userFounded.password) {
        return res.send("invaild user!! <a href='/signin'>back</a>")
      };

      res.redirect('/profile/' + userFounded.username);
    })
    .catch((err) => {
      res.send(err)
    });

});

router.get('/profile/:username', function (req, res, next) {

  User.findOne({ username: req.params.username })
    .then((user) => {
      if (user) {
        res.render('profile', { title: req.params.username, user });
      }
      else {
        res.send("user not found!! <a href='/signin'>back</a>")
      }
    })
    .catch((err) => {
      res.send(err)
    });

});

router.get('/delete/:id', function (req, res, next) {

  User.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect('/signin')
    })
    .catch((err) => {
      res.send(err);
    });

});

router.get('/update/:id', function (req, res, next) {

  User.findById(req.params.id)
    .then((user) => {
      res.render('update', { user, title: 'update-' + user.username })
    })
    .catch((err) => {
      res.send(err);
    });

});

router.post('/update/:id', function (req, res, next) {

  User.findByIdAndUpdate(req.params.id, req.body)
    .then((updatedData) => {
      // res.redirect('/')
      res.redirect("/profile/" + req.body.username)
    })
    .catch((err) => {
      res.send(err);
    });

});

router.get('/logout', function (req, res, next) {

  res.redirect('/signin')

});



module.exports = router;
