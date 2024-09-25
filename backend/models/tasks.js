import mongoose from "mongoose";


// schema
const taskSchema = new mongoose.Schema({
    text : {
        type : String,
        required : true,
        unique: true
    },
    type : {
        type : String,
        required : true
    },
    url : {
        type : String,
    },

    reward : {
        type : String,
        required : true
    }
});

const taskModel = mongoose.model('task',taskSchema);

export default taskModel;