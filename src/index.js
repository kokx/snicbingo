require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/create', (req, res) => {
    console.log(req.body);

    res.send("Test");
});

app.use('/', express.static('public/', { maxAge: 3600*1000 }));

app.listen(5000, () => console.log('Listening....'));
