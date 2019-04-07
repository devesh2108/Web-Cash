var express = require('express');
var testmail = require('./testmail')
var router = express.Router();
var url=require('url');
var usersmodel=require('../models/usersmodel');
const randomstring=require('randomstring') 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.all('/register', function(req, res, next) {  
    if(req.method=='GET')
      res.render('register',{'result':''});
    else
    {
      var public_id=randomstring.generate({
          length:20,
          charset: 'adsadasvhahsdhadjsa7d67as7sa6asidhsa'
      })
      var private_id=randomstring.generate({
          length:20,
          charset: 'ewqeqwavhahsdhadjsa7d67as7sa6asidhsa'
      })  
      req.body.public_id=public_id;
      req.body.private_id=private_id;
     
      usersmodel.userregister('register',req.body,function(result){
        if(result)
          { 
                
             testmail.mymail(req.body.email,req.body.pass,function(){
              res.render('register',{'result':'registered successfully\n\ ,verify your account through your mail'})
          })
          }
          else
              res.render('register',{'result':'registration failed'})    
          })

          var data={'private_id':private_id,'public_id':public_id,'email':req.body.email,'amount':100}
          usersmodel.walletinit('wallet',data,function(result){
              if(result){
                console.log(result);
              }
              else{
                  console.log(err);
              }
          })
      }
  });
  
router.all('/login', function(req, res, next) {
    if(req.cookies.unm!=undefined)
    {
     d={'u':req.cookies.unm,'p':req.cookies.pass,'s':1}
    }
    else
    {
     d={'u':'','p':'','s':0}
    }
    
      if(req.method=="GET")
          res.render('login',{'result':'','d':d});
      else
      {
      var data={'email':req.body.email,'password':req.body.password,'vstatus':'1'}
      usersmodel.logincheck(data,function(result){
                  if(result.length>0)
                  {
    
    if(req.body.chk!=undefined)
    {
     res.cookie('unm',req.body.email,{'expire':3600})
     res.cookie('pass',req.body.password,{'expire':3600})
    }
                    req.session.unm=req.body.email 
    req.session.role=result[0].role
    req.session.public_id=result[1].public_id
    console.log("publicid"+result[1].public_id)
     
                    if(result[0].role=='admin')
             res.redirect('/admin')
            if(result[0].role=='user')
             res.redirect('/users')
              }	    
                  else
                      res.render('login',{'result':'Invalid username or password','d':d});
                          
                  });
                }              
    });
    
    
  router.get('/logout', function(req, res, next) {
    req.session.destroy()
    res.redirect('/login')
  });
  
  router.get('/verify',function(req,res,next){
    var data=url.parse(req.url,true).query
    
    usersmodel.verifyaccount(data,function(result){
        res.redirect('/login')
    })
  })


module.exports = router;
