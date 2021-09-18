const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_FACTOR =10;

require("dotenv").config()

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase:true,
        unique:true,
        index:{unique:true},
        minlength: 2,
        maxlength: 50
    },

    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    role:{
        type: String,
        required: true,
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {
            _id: this._id,
            username: this.username,
            role:this.role
        },
       `${ process.env.jwtPrivateKey}`
    );
    return token;
};


userSchema.pre("save", function(next) {
    const user = this;


    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });

});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model("User", userSchema);


module.exports = User
