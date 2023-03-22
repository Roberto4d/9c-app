const mongoose = require('mongoose');
const Reviews = require('./review')
const { Schema } = mongoose;

const pictureSchema = new Schema({
    url: String,
    filename: String
});

pictureSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const testSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Test must have a name.']
    },
    picture: [pictureSchema],
    description: {
        type: String
    },
    duration: {
        type: String,
        required: [true, 'duration required.']
    },
    categories: {
        type: String,
        lowercase: true,
        enum: ['finger strength', 'upper body', 'flexibility', 'core']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    trainer: {
            type: Schema.Types.ObjectId,
            ref: 'Trainer'
    },
    reviews: 
    [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ] 
});

testSchema.post('findOneAndDelete', async (test) => {
    if(test.reviews.length){
        const deleteResult = await Reviews.deleteMany({_id: {$in: test.reviews  }})
        console.log(deleteResult)
    }
})

module.exports = mongoose.model('Test', testSchema);