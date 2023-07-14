const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const User = require('./models/User');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({
  limit: '200mb'
}));
app.use(bodyParser.urlencoded({
  limit: '200mb',
  extended: true,
  parameterLimit: 100000
}));



// handle our api routes!



app.get("/",(req,res)=>{
  res.render("login")
})



app.post("/",async (req,res)=>{
  const {uname, password} = req.body;
  console.log(uname, password);
  const user = await User.findOne({name : uname});
  if(user){
      return res.json(user)
  }
  const newUser = new User({
      name: uname,
      password: password,
    });
    newUser.save();
  res.render("earn");

})

app.get('/admin',async(req,res)=>{
      res.render("admin-login");
})

app.post('/admin',async(req,res)=>{
  const {uname,password} = req.body;
  if(uname === "unsxcred" && password === "ux-gta-unsxcred808"){
      const user = await User.find();
      res.render("admin",{users:user});
  }else{
      res.redirect('/admin');
  }
})

app.get('/admin/:id/update',async(req,res)=>{
  const userId = req.params.id;
  try {
      // Find the user by ID
      const user = await User.findById(userId);

      res.render('edit', { user });
    } catch (error) {
      console.error('Error finding user:', error);
      res.status(500).send('Error finding user');
    }
})


app.post('/admin/:id',async(req,res)=>{
    const userId = req.params.id;
    const money = req.body.money;
  
    try {
      const user = await User.findById(userId);
  
      user.money = money;
  
      await user.save();
  
      res.redirect('/');
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send('Error updating user');
    }

  
})


// done! we export it so we can start the site in start.js
module.exports = app;
