import mongoose from "mongoose";


// schema
const taskSchema = new mongoose.Schema({
    text : {
        type : String,
        required : true,
        unique: true
    },
    url : {
        type : String,
        required : true
    },

    reward : {
        type : String,
        required : true
    }
});

const taskModel = mongoose.model('task',taskSchema);

export default taskModel;