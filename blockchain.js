const SHA256=require('crypto-js/sha256')
const randomstring=require('randomstring')
var i=0;
class Block{
    constructor(index, nonce, timestamp, tchain, previousHash=''){
        this.index=index;
        this.nonce=nonce;
        this.timestamp=timestamp;
        this.tchain=tchain;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
    }
    calculateHash()
    {
        return SHA256(this.index+this.previousHash+this.nonce+this.timestamp+this.tchain).toString();
    }
}
class Blockchain
{
    constructor(){
        this.chain=[this.createGenesisBlock()];
    }
    createGenesisBlock()
    {
        i++;
        return new Block(0,null,"01/01/2019","Genesis Block","0");
    }
    getBlockIndex()
    {
        return this.chain.length-1;
    }
    getLatestBlock()
    {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newblock)
    {
        newblock.previousHash=this.getLatestBlock().hash;
        newblock.hash=newblock.calculateHash();
        this.chain.push(newblock);
    }

   
}
class Transaction
{
    constructor(id, hash, type, data)
    {
        this.id=id;
        this.hash=hash;
        this.type=type;
        this.data=data;
    }
    

    getTransactionId()
    {
        var txn_id=randomstring.generate({
            length:10,
            charset: 'avhahsdhadjsa7d67as7sa6asidhsa'
          })
          return txn_id;
    }
    calculateHash()
    {
        return SHA256(this.id+this.hash+this.type+this.data).toString();
    }
 
}

class Tchain
{
    constructor()
    {
        this.tchain=[this.getTransaction()];
    }
    getTransaction()
    {
        return new Transaction(0,"edsada","Genesis","Genesis");
    }
    getLatestTransaction()
    {
        return this.tchain[this.tchain.length - 1];
    }

    getTransIndex()
    {
        return this.tchain.length-1;
    }
    addTransaction(newtrans,amt,tadd,sign,type)
    {
        newtrans.id=newtrans.getTransactionId();
        newtrans.hash=newtrans.calculateHash();
        newtrans.type=type;
        newtrans.data={amount:amt,transadd:tadd,signature:sign}
        this.tchain.push(newtrans);

    }
    getTChain()
    {
        return this.tchain;
    }
    
}
let ourcur=new Blockchain();
let trans=new Transaction();
let tch=new Tchain();
ourcur.addBlock(new Block(i,0,Date(),
tch.getTChain()));
i++;

module.exports={'blockchainobj':ourcur,'tchainobj':tch,'Tchain':Tchain,'Transaction':Transaction,'ourcur':ourcur,'Block':Block,'Blockchain':Blockchain};