const { ObjectId, bit } = require("mongodb");
const { integer } = require("mongodb");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const evaluationSchema = new Schema(
    {
        evalid: {
            type: ObjectId,    
        },    
        board: {
            type: String,    
        },
        qualification: {
            type: String,
        },
        course: {
            type: String,
        },
        subject: {
            type: String,
        },
        description: {
            type: String,
        },
        // author: {
        //     type: String,
        // },
        // createdate: {
        //     type: Date,
        // },
        // tags: {
        //     type: String,
        // },
        // totalquestion: {
        //     type: Number,
        //     min: 0,
        //     required: true,

        // },
        // totalmarks: {
        //     type: Number,
        //     min: 0,
        //     required: true,
        // },
        // studentstaken: {
        //     type: Number,
        //     min: 0,
        //     required: true,
        // },
        // stupass: {
        //     type: Number,
        //     min: 0,
        //     required: true,
        // },
        // stufail: {
        //     type: Number,
        //     min: 0,
        //     required: true,
        // },
        // batch: {
        //     type: String,
        // },
        // dataadded: {
        //     type: Date,
        // },
        // datemodified: {
        //     type: Date,
        // },
        // createby: {
        //     type: String,
        // },
        // modifiedby: {
        //     type: String,
        // },
    },
    { timestamps: true }
);

const Evaluation = mongoose.model("Evaluation", evaluationSchema);

module.exports = Evaluation;