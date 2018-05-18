var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;

var app = express();

/*
// Middleware
var logger = function name(req, res, next) {
  console.log('Logging ...');
  next();
}
app.use(logger);
*/

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set static path
app.use(express.static(path.join(__dirname, 'public')));

// Gloabal vars
app.use(function(req, res, next){
  res.locals.errors = null;
  next();
});

app.use(expressValidator());

// JSON parse example
// var person  =[
//   {
//     name: 'jeff',
//     age:30
//   },
//   {
//     name: 'jeff',
//     age:30
//   },
//   {
//     name: 'jeff',
//     age:30
//   }
// ] 
// var users = [
//   {
//     id: 1,
//     first_name: 'jeff',
//     last_name: 'fox',
//     email: 'xyz@gmail.com',
//   },
//   {
//     id: 2,
//     first_name: 'jeff',
//     last_name: 'fox',
//     email: 'xyz@gmail.com',
//   },
//   {
//     id: 3,
//     first_name: 'jeff',
//     last_name: 'fox',
//     email: 'xyz@gmail.com',
//   },
// ]
app.get('/', function (req, res) {
  
  // find everything
  db.users.find(function (err, docs) {
    res.render('index', {
      title: 'Customers',
      users: docs
    });
  })
});

app.post('/users/add', function (req, res) {
  
  req.checkBody('first_name', 'First Name is Required.').notEmpty();
  req.checkBody('last_name', 'Last Name is Required.').notEmpty();
  req.checkBody('email', 'Email is Required.').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.render('index', {
      title: 'Customers',
      users: users,
      errors: errors
    })
  } else {
    var newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email
    }
    db.users.insert(newUser, function(err, result){
      if(err){
        console.log(err);
      }
      res.redirect('/');
    });
  }
});

app.delete('/users/delete/:id', function(req, res){
  db.users.remove({_id: ObjectId(req.params.id)}, function(err){
    if(err){
      console.log(err);
    }
    res.redirect('/');
  });
});  

app.listen(7777, function () {
  console.log('Your port running at 7777');
});