const jwt = require('jsonwebtoken');
const Instructor = require('../models/Instructor');

const auth = async(req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, process.env.JWT_KEY);
    try {
        const instructor = await Instructor.findOne({ _id: data._id, 'tokens.token': token });
        if (!instructor) {
            throw new Error();
        }
        req.instructor = instructor;
        req.token = token;
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' });
    }

}
module.exports = auth;