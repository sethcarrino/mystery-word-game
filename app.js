const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');
const parseurl = require('parseurl');
const expressValidator = require('express-validator');
const session = require('express-session');
const jsonfile = require('jsonfile');


// require other js code for routing
const router =  require('./router');
const workings = require('./workings');


// creating express app
const app = express();


// start template engine which is handlebars
app.engine('handlebars', exphbs());
app.set('views', './views')
app.set('view engine', 'handlebars')

// setup seesion middleware
app.use(session({
  secret: 'V4P3N4710N',
  resave: false,
  saveUninitialized: true,
  cookie: {}}))

// setup router to use
app.use(router);

// listen on designated port
app.listen(3000, function(){
  console.log("Successfully started mystery word application");
})
