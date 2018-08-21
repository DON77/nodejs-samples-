const jwt = require('jsonwebtoken');
const validator = require('../validator');
const mailer = require('../mailer');
const generator = require('generate-password');


function handleError(err){
  console.log(err);
};

module.exports = function(app,User,Notes){

    app.get('/', (req, res)=>{

      var decoded = jwt.decode(req.cookies.token, app.get('tokenSecret'));
      if ( decoded ) {
        return res.redirect("/user");
      }

      var data = {
        partial:"../partials/starter.ejs",
        login:{
          attempt:"attempt",
          username: ""
        },
        register:{
          attempt:"attempt",
          username: "",
          email: "",
          name: "",
          surename: ""
        }
      };
      res.render('pages/index', data);
    });

    app.get('/login', (req, res)=>{

        var data = {
          partial:"../partials/starter.ejs",
          login:{
            attempt:"failure",
            username: req.query.username
          },
          register:{
            attempt:"attempt",
            username: "",
            email: "",
            name: "",
            surename: ""
          }
        };

      User.findOne({ username: req.query.username },function(err,user){
          if (err) return handleError(err);
          if (!user) return res.render('pages/index', data);
          if (!user.validPassword(req.query.password)) {
                res.render('pages/index', data);
              } else {
                const payload = {
                  username: user.username
                };
                var token = jwt.sign(payload, app.get('tokenSecret'), {
                  expiresIn: "1w"
                });
                res.cookie('token' , token);
                res.redirect("/user");
              }
      });

    });

    app.get('/register', (req, res)=>{

        var data = {
          partial:"../partials/starter.ejs",
          login:{
            attempt:"attempt",
            username: ""
          },
          register:{
            attempt:"failure",
            msg:"",
            username: req.query.username,
            email: req.query.email,
            name: req.query.name,
            surename: req.query.surename
          }
        };

      User.findOne({ $or: [{ username: data.register.username }, { email: data.register.email }] },function(err,user){
          if (err) return handleError(err);
          if (user) {
            if( user.username == data.register.username ) data.register.msg = "Username you provided is already in use, please provide another one.";
            if( user.email == data.register.email ) data.register.msg = "Email address you provided is already in use, please provide another one.";
            res.render('pages/index', data);
          } else {
            if( !validator.validate(data.register) ) {
              return res.redirect("/");
            }

            var newUser = new User({
                username: data.register.username,
                name: data.register.name,
                surename: data.register.surename,
                email:  data.register.email,
                password: req.query.password,
                partners: []
            });

            //req.cookies.token
            newUser.save((err,user)=>{
              if (err) return handleError(err);
              var newNotes = new Notes({
                username:user.username,
                notes:[]
              });
              newNotes.save((err)=>{
                if (err) return handleError(err);
                const payload = {
                  username: user.username
                };
                var token = jwt.sign(payload, app.get('tokenSecret'), {
                  expiresIn: "1w"
                });
                res.cookie('token' , token);
                res.redirect("/user");
              });
            });
          }
      });

    });

    app.get('/user', (req, res)=> {
      var decoded = jwt.decode(req.cookies.token, app.get('tokenSecret'));
      if ( !decoded ) {
        res.clearCookie('token');
        return res.redirect("/");
      }
      User.findOne({username:decoded.username},(err,user)=>{
        if (err) return handleError(err);
        if (!user) return res.redirect("/");
        User.find({ username: { $in: user.partners } }).select( 'username email isOnline').exec((err,partners)=>{
          //console.log(partners);
            if (err) return handleError(err);
            Notes.findOne({username:user.username},(err,notes)=>{
              res.render("pages/index",{
                partial:"../partials/user.ejs",
                user:{
                  username: user.username,
                  name: user.name,
                  surename: user.surename,
                  email: user.email
                },
                notes: notes.notes,
                partners: partners
              });
            });
        });
      });
    });

    app.get('/changepassword', (req, res)=> {
      var decoded = jwt.decode(req.cookies.token, app.get('tokenSecret'));
      if ( !decoded ) {
        res.clearCookie('token');
        return res.redirect("/");
      }
      res.render("pages/index",{
        partial:"../partials/changepassword.ejs",
        attempt:"attampt",
        msg:""
      });
    });

    app.post('/changepassword', (req, res)=> {
      var decoded = jwt.decode(req.cookies.token, app.get('tokenSecret'));
      if ( !decoded ) {
        res.clearCookie('token');
        return res.redirect("/");
      }
      User.findOne({username:decoded.username},(err,user)=>{
          if (err) return handleError(err);
          if(!user.validPassword(req.body.oldpassword)) {
            res.render("pages/index",{
              partial:"../partials/changepassword.ejs",
              attempt:"failure",
              msg:"Incorrect password"
            });
          } else {
            user.password = req.body.newpassword;
            user.save(function(err,user){;
              if (err) return handleError(err);
              return res.redirect("/user");
            });
          }
      });
    });

    app.get("/forgotpassword",(req,res)=>{
      res.render("pages/index",{
        partial:"../partials/forgotpassword.ejs",
        attempt:"attampt",
        msg:"",
        username:""
      });
    });

    app.post("/forgotpassword",(req,res)=>{
      User.findOne({username:req.body.username},(err,user)=>{
          if (err) return handleError(err);
          if (!user) {
            res.render("pages/index",{
              partial:"../partials/forgotpassword.ejs",
              attempt:"failure",
              msg:"User with this username does note exist.",
              username: req.body.username
            });
          } else {
            var password = generator.generate({
                length: 10,
                numbers: true
            });
            user.password = password;
            user.save(function(err){
              if (err) return handleError(err);
              mailer.send(user.email,"Your new password is '" + password + "'","Password change");
              res.redirect("/");
            });
          };
      });
    });

}
