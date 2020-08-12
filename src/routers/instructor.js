const express = require('express');
const Instructor = require('../models/Instructor');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const router = express.Router();
    
router.post('/instructor', async (req, res) => {
    // Create a new instructor
    try {
        const instructor = new Instructor(req.body);
        await instructor.save();
        const token = await instructor.generateAuthToken();
        res.status(201).send({ instructor, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/instructor/login', async(req, res) => {
    //Login a registered instructor
    try {
        const { email, password } = req.body;
        const instructor = await Instructor.findByCredentials(email, password);
        if (!instructor) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'});
        }
        const token = await instructor.generateAuthToken();
        res.send({ instructor, token });
    } catch (error) {
        res.status(400).send(error);
    }

});

router.get('/instructor/me', auth, async(req, res) => {
    // View logged in instructor profile
    res.send(req.instructor)
});

router.post('/instructor/me/logout', auth, async (req, res) => {
    // Log instructor out of the application
    try {
        req.instructor.tokens = req.instructor.tokens.filter((token) => {
            return token.token != req.token;
        })
        await req.instructor.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/instructor/me/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.instructor.tokens.splice(0, req.instructor.tokens.length);
        await req.instructor.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/instructor/me/students', auth, async (req,res) => {
    // Create a new student
    try {
        const student = new Student(req.body);
        await student.save();
        // const token = await student.generateAuthToken();
        res.status(201).send(student);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/instructor/me/students/studentsList', auth, async (req,res) => {
    try {
        Student.find({}, (err, students) => {
            if(err) {
                res.send("Something went wrong");
                next();
            }
            res.status(200).send(students);
        });
     } catch (error) {
         res.status(400).send(error);
     }
    // res.send(req.student);
});

router.put('/instructor/me/students/:id', auth, async (req,res) => {
    Student.update({_id: req.params.id}, req.body)
        .then(doc =>{
            if(!doc){
                return res.status(404).end();
            }
            return res.status(200).json(doc);
        })
        .catch(err => next(err));
});

router.delete('/instructor/me/students/:id', auth, async (req,res) => {
    await Student.findByIdAndRemove(req.params.id)
        .then(doc => {
            if(!doc) {
                return res.status(404).end();
            }
            return res.status(204).end();
        })
        .catch(err => next(err));
});

module.exports = router;