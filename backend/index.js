const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

const highscoresFilePath = path.join(__dirname, 'highscores.json');

app.use(express.json());
app.use(cors());


app.get('/highscores', (req, res) => {
    fs.readFile(highscoresFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Kunde inte läsa highscores');
        }
        res.send(data);
    });
});

app.post('/highscores', (req, res) => {
    console.log("Received data:", req.body);
    const newScore = req.body;

    fs.readFile(highscoresFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Kunde inte läsa highscores');
        }
        let scores = JSON.parse(data);

        scores.push(newScore);

        // Uppdatera fältet här för att matcha frontend
        scores.sort((a, b) => b.score - a.score);

        scores = scores.slice(0, 5);

        fs.writeFile(highscoresFilePath, JSON.stringify(scores, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Kunde inte uppdatera highscores');
            }
            res.send({ message: 'Highscore uppdaterad' });
        });
    });
});

app.listen(3000, () => {
    console.log('Listening on port 3000 ...');
});
