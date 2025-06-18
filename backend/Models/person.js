const mongoose = require('mongoose');

// Connect to the database
const personSchema = new mongoose.Schema({
    name:
    {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
    },
    age: {
        type: Number     
    },

    work: {
        type: String,
        enum: ['Developer', 'Designer', 'Manager','HR', 'Intern' ,'Tester' ],
        require: true
    },
    address: {
        type: String,
        require: true
    },

    salary: {
        type: Number,
        default: 15487,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "Auth",
    },
    
});



// create person model

const Person = mongoose.model('Person', personSchema);
module.exports = Person;