const express = require('express');
const studentRouter = require('./routers/student');
const port = process.env.PORT;
require('./db/db');

const app = express();

app.use(express.json());       //instead  of body-parser
app.use(studentRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});