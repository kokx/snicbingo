require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sqlite = require('sqlite3');
const crypto = require('crypto');
const fs = require('fs');
const _ = require('lodash');

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// initialize database
const db = new sqlite.Database('./snic.sqlite');
db.serialize(() => {
    db.run(
        'CREATE TABLE IF NOT EXISTS cards ' +
            '(id integer not null primary key autoincrement, ' +
            'shortcode varchar not null, ' +
            'name varchar not null, ' +
            'sq11 varchar not null, ' +
            'sq12 varchar not null, ' +
            'sq13 varchar not null, ' +
            'sq14 varchar not null, ' +
            'sq15 varchar not null, ' +
            'sq21 varchar not null, ' +
            'sq22 varchar not null, ' +
            'sq23 varchar not null, ' +
            'sq24 varchar not null, ' +
            'sq25 varchar not null, ' +
            'sq31 varchar not null, ' +
            'sq32 varchar not null, ' +
            'sq33 varchar not null, ' +
            'sq34 varchar not null, ' +
            'sq35 varchar not null, ' +
            'sq41 varchar not null, ' +
            'sq42 varchar not null, ' +
            'sq43 varchar not null, ' +
            'sq44 varchar not null, ' +
            'sq45 varchar not null, ' +
            'sq51 varchar not null, ' +
            'sq52 varchar not null, ' +
            'sq53 varchar not null, ' +
            'sq54 varchar not null, ' +
            'sq55 varchar not null, ' +

            'b11 boolean default 0, ' +
            'b12 boolean default 0, ' +
            'b13 boolean default 0, ' +
            'b14 boolean default 0, ' +
            'b15 boolean default 0, ' +
            'b21 boolean default 0, ' +
            'b22 boolean default 0, ' +
            'b23 boolean default 0, ' +
            'b24 boolean default 0, ' +
            'b25 boolean default 0, ' +
            'b31 boolean default 0, ' +
            'b32 boolean default 0, ' +
            'b33 boolean default 0, ' +
            'b34 boolean default 0, ' +
            'b35 boolean default 0, ' +
            'b41 boolean default 0, ' +
            'b42 boolean default 0, ' +
            'b43 boolean default 0, ' +
            'b44 boolean default 0, ' +
            'b45 boolean default 0, ' +
            'b51 boolean default 0, ' +
            'b52 boolean default 0, ' +
            'b53 boolean default 0, ' +
            'b54 boolean default 0, ' +
            'b55 boolean default 0' +
            ')'
    );
});

let bingo = ['NOT INITIALIZED PROPERLY'];

// read bingo list
fs.readFile('./bingo_list_2019.txt', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    bingo = data.trim().split(/\r?\n/);
});


app.post('/create', (req, res) => {
    const sqcols = ['sq11', 'sq12', 'sq13', 'sq14', 'sq15',
                    'sq21', 'sq22', 'sq23', 'sq24', 'sq25',
                    'sq31', 'sq32', 'sq33', 'sq34', 'sq35',
                    'sq41', 'sq42', 'sq43', 'sq44', 'sq45',
                    'sq51', 'sq52', 'sq53', 'sq54', 'sq55']
    const sqcolsc = sqcols.map(t => '$' + t);
    const stmt = db.prepare("INSERT INTO cards (shortcode, name, " + sqcols.join(', ') + ") VALUES ($shortcode, $name, " + sqcolsc.join(', ') + ")");

    const shortcode = crypto.randomBytes(10).toString('hex');

    let vals = {
        $shortcode: shortcode,
        $name: req.body.name
    };

    const bingoSample = _.sampleSize(bingo, 25);

    sqcols.forEach(col => { vals['$' + col] = bingoSample.pop(); });

    stmt.run(vals);
    stmt.finalize();

    res.send("Test + <a href='/card/" + shortcode +"'>Bingo!</a>");
});

app.get('/card/:code', (req, res) => {
    db.all("SELECT * FROM cards WHERE shortcode = ?", [req.params.code], (err, rows) => {
        if (err === null && rows.length === 1) {
            data = rows[0];
            let tableContents = '';
            for (let i = 1; i <= 5; i++) {
                tableContents += '<tr>';
                for (let j = 1; j <= 5; j++) {
                    tableContents += '<td>' + data['sq' + i.toString() + j.toString()] + '</td>'
                }
                tableContents += '</tr>'
            }
            res.send('<table border="1">' + tableContents + '</table>');
        } else {
            res.send("Nope.");
        }
    });
});

app.use('/', express.static('public/', { maxAge: 3600*1000 }));

app.listen(5000, () => console.log('Listening....'));
