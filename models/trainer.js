const mongoose = require("mongoose");
const Test = require("./test")
const {Schema} = mongoose;

const trainerSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["Mujer", "Hombre"]
    },
    age: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    height: {
        type: Number,
    },
    wingSpan:{
        type: Number,
    },
    redpointLead:{
        type: String,
    },
    redpointBoulder:{
        type: String,
    },
    picture: {
        type: String
    },
    description: {
        type: String
    },
    test: [ 
        {
            type: Schema.Types.ObjectId,
            ref: 'Test'
        }
    ]
});

trainerSchema.post('findOneAndDelete', async (trainer) => {
    if(trainer.test.length){
        const deleteResult = await Test.deleteMany({_id: {$in: trainer.test  }})
        console.log(deleteResult)
    }
})

module.exports = mongoose.model('Trainer', trainerSchema);