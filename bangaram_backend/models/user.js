import mongoose from "mongoose";

// schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    tokens: {
        type: Number,  // Correct for numeric token values
        required: true
    },
    tasks: {
        type: [String], // Assuming tasks are stored as an array of strings (like task names or IDs)
        required: false
    },
    referral_num: {
        type: String,  // Works if the referral number is alphanumeric
        required: true
    },
    wallet_address: {
        type: String,  // Optional wallet address
        required: false
    },
    joined_date: {
        type: Date,  // Date when the user joined
        default: Date.now  // Optional default value to current date
    },
    last_checkin:{
        type:Date,
        required : false
    },
    invited_friends : {
        type: [String],
        required : false
    },
    telegram_id : {
        type : String,
        required : true,
        unique : true
    }
});

// model
const userModel = mongoose.model('user', userSchema);

export default userModel;
