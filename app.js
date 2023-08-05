const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path')

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/sucess', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/sucess.html'));
});

app.post('/comments', (req, res) => {
    const username = req.body.username;
    const comment = req.body.comment;

    // Read existing comments from the JSON file
    fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }

        const comments = JSON.parse(data);
        comments.push({ username, comment });

        // Write updated comments back to the JSON file
        fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments, null, 2), 'utf8', err => {
            if (err) {
                console.error(err);
                return res.status(500).send('Server Error');
            }
            console.log('Comment saved:', comment);
            res.redirect('/');
        });
    });
});


app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }
        const comments = JSON.parse(data);
        res.render('index', { comments });
    });
});




app.get('/comments', (req, res) => {
    fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }
        const comments = JSON.parse(data);
        res.json(comments);
    });
});






app.listen(PORT, () => {
    console.log(`Server is running on port localhost${PORT}`);
});