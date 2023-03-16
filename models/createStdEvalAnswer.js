const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const {Schema} = mongoose;

const studentEvalAnswerSchema = new Schema(

    {
        studevalid:{
            type:ObjectId,
        },  
     evalansid: {
        type: String,    
    },
     evalid: {
        type: String,    
    },  
     questionid:{
         type:String,
     },   
     question:{
         type:String,
     },   
     answerstud:{
         type:String,
     },   
     answer:{
         type:String,
     },   
     marks:{
         type:Number,
     },   
     type:{
         type:String,
     },   
     hint:{
         type:String,
     },   
     qmark:{
         type:String,
     },   
    },
    { timestamps: true }
);

const Studentevalans = mongoose.model("Studentevalans", studentEvalAnswerSchema);

module.exports = Studentevalans;