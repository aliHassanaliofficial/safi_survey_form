const express = require('express');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.get('/:reqPath', (req, res) => {
    const reqPath = req.params.reqPath;
    const csvFilePath = path.join(__dirname, 'public', 'users', `${reqPath}`, 'user_data.csv');
    let userName = 'User Not Found';
    let igUserNm = 'username not attached';

    fs.access(csvFilePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File ${csvFilePath} not found or inaccessible:`, err);
            sendResponse();
        } else {
            const csvStream = fs.createReadStream(csvFilePath)
                .pipe(csv());

            csvStream.on('data', (data) => {
                userName = data.userName || 'User Not Found';
                igUserNm = data.igUserNm || 'username not attached';
            });

            csvStream.on('end', () => {
                sendResponse();
            });

            csvStream.on('error', (csvErr) => {
                console.error('Error reading or parsing CSV file:', csvErr);
                sendResponse();
            });
        }
    });

    function sendResponse() {
        const imgPath = `/users/${reqPath}/photo.jpg`;
        res.render('header', { reqPath, imgPath, userName, igUserNm });
    }
});

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });

module.exports = app;