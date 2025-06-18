const mongoose = require('mongoose');

// Connect to the database
const authSchema = new mongoose.Schema({
    
    username:{
        type: String,
        require:true,
    },
    
    password:{
        type: String,
    },
    role :{
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
     resetToken: String,
  resetTokenExpiry: Date,

});

const Auth = mongoose.model('Auth', authSchema);
module.exports = Auth;