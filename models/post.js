const mongoose = require('mongoose');
const { SchemaTypes } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');


const PostSchema = mongoose.Schema(
    {
        Id: {
            type: SchemaTypes.ObjectId
        },
        Title: {
            type: String,
            required: [true, 'Title is required']
        },
        Content: {
            type: String,
            required: 'Content is required'
        },
        Author: {
            type: SchemaTypes.ObjectId,
            ref: "User",
        },
        NumOfLikes: {
            type: Number,
        },
        NumOfComments: {
            type: Number,
        }
    }, 
    {
        timestamps: true
    }
);

PostSchema.plugin(mongoosePaginate);
module.exports =  mongoose.model('Post', PostSchema)