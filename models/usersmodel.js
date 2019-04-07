var db=require('./conn')

function usersmodel(){
    this.userregister=function(cnm,data,cb){
        db.collection(cnm).insert(data,function(err,result){
        if(err)
            console.log(err)
        else
            cb(result)
        })

    }

    this.walletinit=function(cnm,data,cb){
        db.collection(cnm).insert(data,function(err,result){
            if(err){
                console.log(err)
            }
            else{
                cb(result)
            }
        })
    }
    this.getwalletamt=function(data,cb){
        db.collection('wallet').find(data).toArray(function(err,result){
            if(err){
                console.log(err)
            }
            else{
                cb(result)
            }
        })
    }

    this.logincheck=function(data,cb)
    {
        db.collection('register').find(data[0]).toArray(function(err,result){
            if(err)
                console.log(err)
            else
                cb(result)
        })
    }

    this.updatewallet=function(data,amount,cb){
        db.collection('wallet').update(data,{$set:{'amount':amount}},function(err,result){
            if(err){
                console.log(err)
            }
            else{
                cb(result)
            }
        })
    }

    this.addtransaction=function(data,cb){
        db.collection('transaction').insert(data,function(err,result){
            if(err)
            console.log(err)
            else
            cb(result)
        })
    }
    this.verifyaccount=function(data,cb)
    {
        console.log('hello')
        db.collection('register').update({'email':data.email},{$set:{'vstatus':'1'}},function(err,result){
        if(err)
            console.log(err)
        else
            cb(result)
    })
   
    }
    this.getdetails=function(data,cb){
        db.collection('register').find(data).toArray(function(err,result){
            if(result){
                console.log("res"+result[1].public_id)
                cb(result)
            }
            else{
                console.log(err)
            }
        })
    }


}
module.exports=new usersmodel()





