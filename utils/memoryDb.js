const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo = null;

const connectDB = async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    await mongoose.connect(uri, {
        dbName: 'memoryDB',
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

const disconnectDB = async () => {
    if (mongo) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    }
};

const dropCollections = async () => {
    if (mongo) {
        await mongoose.connection.dropCollections();
    }
};

module.exports = { connectDB, disconnectDB };
