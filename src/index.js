require('dotenv').config();
const express = require('express');

const app = express();

app.use('/', express.static('public/', { maxAge: 3600*1000 }));

app.listen(5000, () => console.log('Listening....'));
