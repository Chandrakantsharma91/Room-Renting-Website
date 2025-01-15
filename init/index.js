const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/AirBnb";

main().then(()=>{
    console.log("connect DB");
}).catch((err)=>{
    console.log(err);
    
})
async function main() {
    await mongoose.connect(MONGO_URL)
};

const InitDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ( {...obj , owner : '6767cfb27e71a1614393ce61'} ));
    await Listing.insertMany(initData.data);
    console.log("data was initlized");
    
};

InitDB();