var express = require('express');
var router = express.Router();
var usersmodel=require('../models/usersmodel');
var randomstring=require('randomstring')
var blockchain=require('../blockchain')
var tranamt;
var myuser;
var myuserrole;
var public_key;
router.use('/', function(req, res, next) {
  myuser=req.session.unm
  myuserrole=req.session.role
  public_key=req.session.public_id
  console.log(public_key)
  console.log(myuser);

  if(myuser==undefined || myuserrole!='user')
  {
   console.log('Invalid user please login first, IP tracking')
   res.redirect('/login') 
  }	
  next()
});

/* GET users listing. */
router.all('/', function(req, res, next) {
  data={'email':myuser}
 usersmodel.getdetails(data,function(result){
   console.log(result)
      res.render('userhome',{'myuser':myuser, 'result':result});
  })
 // res.render('userhome',{'myuser':myuser});
});

router.get('/payment', function(req, res, next) {
  data={'email':myuser}
  usersmodel.getwalletamt(data,function(result){
    console.log(result)
    res.render('payment',{'result':result});
  })
});


router.all('/blockchain', function(req, res, next){
  if(req.method=='GET')
  res.render('blockchain',{'result':''});
else
  {
      var amt=req.body.amt;
      var tadd=req.body.tadd;
      var sign=req.body.sign;
      var type=req.body.type;
      var blockchainobj=blockchain.blockchainobj;
      var tchainobj=blockchain.tchainobj;
      var transindex=blockchain.tchainobj.getTransIndex();
      var blockindex=blockchain.blockchainobj.getBlockIndex();
      var Block=blockchain.Block;
      if(transindex>5)
      {
          curblock=blockchainobj.getLatestBlock();
          blockchainobj=new blockchain.Blockchain();
          blockchainobj.addBlock(new Block(blockindex+1,0,Date(),
          tchainobj.getTChain()))
      }
      else
      {
      var Transaction=blockchain.Transaction;
     
      tchainobj.addTransaction(new Transaction(),amt,tadd,sign,type);
      }
      
      res.render('transblock',{'result':JSON.stringify(blockchainobj)});
  }
})

router.all('/transferwebcash',function(req,res,next){
  data={'email':myuser}
  usersmodel.getwalletamt(data,function(result1){
    console.log(req.body)
    let avaiamt=result1[0].amount 
    console.log(req.body.amount)   
  tranamt=req.body.amount
  if(tranamt > avaiamt){
    res.render('payment',{'result':'insufficient balance in wallet'})
  }   
  else{
    avaiamt=avaiamt-tranamt
    data1={'public_id':public_key}
    usersmodel.updatewallet(data1,avaiamt,function(result){
      res.render('payment',{'result':[{'amount':avaiamt}], 'result1':'trans done'})
    })
  }
})
    data2={'public_id':public_key,'transaddress':req.body.transadd,'date':Date(),'transamount':req.body.amount}
    usersmodel.addtransaction(data2,function(result){
      console.log(result)
    })
  }
)

module.exports = router;
