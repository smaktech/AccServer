
const { ObjectId, bit } = require("mongodb");
const { integer } = require("mongodb");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const questionSchema = new Schema(
    {
        ID: {
            type: ObjectId,    
        },
        question: {
            type: String,
        },
        author: {
            type: String,
        },
        image: {
            type: String,   
        },
        media:{
            type: String,
        },
        
        hint: {
            type: String,
        },
        dateadded: {
            type: Date,
        },
        datemodified: {
            type: Date,
        },
        createdby: {
            type: String,
        },
        modifiedby: {
            type: String,
        },

    },
    { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;