const mongoose=require('mongoose');

const db=()=>{
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log('Server is connected with Database Successfully.')
    }).catch((err)=>{
        console.log(err);
        console.log("Something went wrong while connecting Database with Server");
        process.exit(0)
    })

}

module.exports=db;