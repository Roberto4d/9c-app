const mongoose = require("mongoose");
const Test = require("./test")
const {Schema} = mongoose;

const userSchema = new Schema({
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

userSchema.post('findOneAndDelete', async (user) => {
    if(user.test.length){
        const deleteResult = await Test.deleteMany({_id: {$in: user.test  }})
        console.log(deleteResult)
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User