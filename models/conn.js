var mongoose=require('mongoose')
var url="mongodb://localhost:27017/fintech"
mongoose.connect(url)
var db=mongoose.connection
console.log("connection done with mongoose!!!!!!!!!!!")
module.exports=db