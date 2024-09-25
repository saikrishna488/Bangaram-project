import mongoose from "mongoose";


// schema
const adminSchema = new mongoose.Schema({
    key : {
        type : String,
        required : true,
        unique: true
    },
});

const adminModel = mongoose.model('admin',adminSchema);

export default adminModel;