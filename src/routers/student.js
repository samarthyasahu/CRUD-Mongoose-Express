const express = require('express');
const Student = require('../models/Student');
const { reset } = require('nodemon');

const router = express.Router();

router.post('/students', async (req,res) =>{
    // Create a new student
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).send(student);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/students/studentsList', async(req,res) => {
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
});

router.put('/students/:id', async(req,res) => {
    Student.update({_id: req.params.id}, req.body)
        .then(doc =>{
            if(!doc){
                return res.status(404).end();
            }
            return res.status(200).json(doc);
        })
        .catch(err => next(err));
});

router.delete('/students/:id', async(req,res) => {
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