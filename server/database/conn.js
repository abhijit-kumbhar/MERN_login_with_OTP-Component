const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const ENV = require('../config.js')

async function connect(){
    // const mongod = await MongoMemoryServer.create();
    // const getUri = mongod.getUri();

    mongoose.set('strictQuery', true)
    // const db = await mongoose.connect(getUri);
    const db = await mongoose.connect(ENV.ATLAS_URL);
    console.log("Database Connected");
    return db;
}

module.exports = connect;