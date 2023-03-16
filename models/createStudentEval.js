const { date } = require("joi");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const {Schema} = mongoose;

const studentevalSchema = new Schema(

    {
    //     studevalid:{
    //      type:ObjectId,
    //  },   
     evalid: {
        type: String    
    },   
     studentname:{
         type:String,
     },   
     course:{
         type:String,
     },   
     subject:{
         type:String,
     },   
        
     status:{
         type:String,
     },   
    },
    { timestamps: true }
);

const Studenteval = mongoose.model("Studenteval", studentevalSchema);

module.exports = Studenteval;