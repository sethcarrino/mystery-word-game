const express = require('express');
const router = express.Router()
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');
const parseurl = require('parseurl');
const expressValidator = require('express-validator');
const session = require('express-session');
const jsonfile = require('jsonfile');

// pull functionality from workings.js
const work = require('./workings.js')

// tell jsonfile to read the winner.json file
const file = 'winners.json';
let winners;
jsonfile.readFile(file, function(err, obj) {
  winners = obj;
})

// configure root path
router.get("/", function (req, res) {
  res.render('home');
});

router.post("/", function (req, res) {
  req.session.game = work.createGame(req.body.play);
  res.redirect('/play');
})

// configure /play path
router.get("/play", function (req, res) {

  if (req.session.game) {
    let game = req.session.game[0];
      res.render('play', { display: game });

  } else {
    res.redirect('/');
  }
});

router.post("/play", function (req, res) {
  let game = req.session.game[0];
  let guess = req.body.guess;
  game = work.checkGuess(game, guess);
  req.session.game[0] = game;
  res.redirect('/play');
});

// when you win you data is pushed to winners array and logged
router.post('/win', function (req, res) {
  let word = req.session.game[0].word;
  let guesses = req.session.game[0].totalGuesses;
  let difficulty = req.session.game[0].difficulty;
  req.checkBody("name", "You must enter a name!").notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    res.render('error');
  } else {
    let name = req.body.name;
    let id = winners.winners.length;
    winners.winners.push({"id": id, "name": name, "word": word, "guesses": guesses, "difficulty": difficulty});
    jsonfile.writeFileSync(file, winners);
    res.redirect('/winners');
  }
});

// configure winner path
router.get('/winners', function (req, res) {
  res.render('winners', { display: winners.winners });
});

module.exports = router;
