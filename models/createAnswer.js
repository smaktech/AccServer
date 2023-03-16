
const { string } = require("joi");
const { ObjectId, bit } = require("mongodb");
const { integer } = require("mongodb");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const answerSchema = new Schema(
    {
        ID: {
            type: ObjectId,    
        },
        Questiontableid: {
            type: ObjectId,    
        },
        ansid: {
            type: ObjectId,
        },
        inputfields:{
            type: Array,
        },
        mcqFields:{
            type: Array,
        },
        mcqtypeFields:{
            type: Array,
        },
        qid: {
            type: String,            
        },
        // evalid: {
        //     type: String,
        // },
        hint: {
            type: String,
        },
        formula: {
            type: String,
        },
        // media: {
        //     type: String,
        // },
        // question: {
        //     type: String,
        // },

        type: {
            type: String,
        },
        answer: {
            type: String,
        },
        marks: {
            type: Number,
        },
        author: {
            type: String,
        },
        dateadded: {
            type: Date,
        },
        datemodified: {
            type: Date,
        },
        createdby: {
            type:String,
        },
        modifiedby: {
            type: String,
        },
    },
    { timestamps: true }
);

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;