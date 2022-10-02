const mongoose = require('mongoose');
const { SchemaTypes } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');


const CommentSchema = mongoose.Schema(
    {
        Id: {
            type: SchemaTypes.ObjectId
        },
        PostId: {
            type: String,
            required: [true, 'Post ID is required']
        },
        Comment: {
            type: String,
            required: 'Comment is required'
        },
        Author: {
            type: SchemaTypes.ObjectId,
            ref: "User",
            required: 'Author ID is required'
        }
    }, 
    {
        timestamps: true
    }
);

CommentSchema.plugin(mongoosePaginate);
module.exports =  mongoose.model('Comment', CommentSchema);