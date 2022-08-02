const mongoose = require('mongoose');
const { Schema } = mongoose;

const websiteSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

websiteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Website = mongoose.model('Website', websiteSchema);

module.exports = Website;
