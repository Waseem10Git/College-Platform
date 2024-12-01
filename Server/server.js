const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const conn = require('./config/db');
const createTables = require('./config/createTables');
const port = process.env.PORT || 4001;
const path = require('path');

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
    origin: ["https://college-platform.netlify.app", "http://localhost:3000", "http://localhost:3001"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use routes
require('./routes')(app);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../Client/build')));

// Catch-all handler for routes handled by React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/build', 'index.html'));
});

server.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});


// conn.connect(err => {
//     if (err) {
//         console.error('Database connection failed: ', err.stack);
//         return;
//     }
//     console.log('Connected to MySQL database.');
//
//     createTables()
//         .then(() => {
//             console.log('All tables created successfully');
//
//             server.listen(port, "0.0.0.0", () => {
//                 console.log(`Server is running on port ${port}`);
//             });
//         })
//         .catch(err => {
//             console.error('Error creating tables: ', err);
//             process.exit(1);
//         });
// });