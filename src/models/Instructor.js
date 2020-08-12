const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const instructorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'})
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

instructorSchema.pre('save', async function (next) {
    const instructor = this;
    if (instructor.isModified('password')) {
        instructor.password = await bcrypt.hash(instructor.password, 8);
    }
    next()
});

instructorSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const instructor = this;
    const token = jwt.sign({_id: instructor._id}, process.env.JWT_KEY);
    instructor.tokens = instructor.tokens.concat({token});
    await instructor.save();
    return token;
}

instructorSchema.statics.findByCredentials = async (email, password) => {
    // Search for a instructor by email and password.
    const instructor = await Instructor.findOne({ email} )
    if (!instructor) {
        throw new Error({ error: 'Invalid login credentials' });
    }
    const isPasswordMatch = await bcrypt.compare(password, instructor.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' });
    }
    return instructor;
}

const Instructor = mongoose.model('Instructor', instructorSchema);

module.exports = Instructor;

