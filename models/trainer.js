const { string } = require("joi");
const mongoose = require("mongoose");
const Test = require("./test");
const {Schema} = mongoose;


const pictureSchema = new Schema({
    url: String,
    filename: String
});

pictureSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const trainerSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    location:{
        type: String
    },
    geometry: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
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
    picture: [pictureSchema],
    description: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    test: [ 
        {
            type: Schema.Types.ObjectId,
            ref: 'Test'
        }
    ]
}, opts);

trainerSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href="/trainers/${this._id}">${this.firstName} ${this.lastName}</a>`
});

trainerSchema.post('findOneAndDelete', async (trainer) => {
    if(trainer.test.length){
        const deleteResult = await Test.deleteMany({_id: {$in: trainer.test  }})
        console.log(deleteResult)
    }
})

module.exports = mongoose.model('Trainer', trainerSchema);