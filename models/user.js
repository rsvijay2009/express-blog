const mongoose = require('mongoose');

const  validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = mongoose.Schema(
    {
        FirstName: {
            type: String,
            required: [true, 'First name is required']
        },
        LastName: {
            type: String,
            required: [true, 'Last name is required']
        },
        Email: {
            type: String,
            required: 'Email address is required',
            validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        Password: {
            type: String,
            required: [true, 'Password is required']
        },
        ProfilePic: {
            type: String,
        },
        Status: {
            type: String,
        }
    }, 
    {
        timestamps: true
    }
);

module.exports =  mongoose.model('User', userSchema)