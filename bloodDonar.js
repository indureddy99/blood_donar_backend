import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import autenticationRoute from './routes/authenticationRoutes.js';
import bloodBankRoutes from './routes/bloodBankRoutes.js';
import { db } from './config/dbConfig.js';

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        res.header('ACCESS-CONTROL-ALLOW-METHODS', 'PUT, POST, PATCH, GET, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    const sql = 'INSERT INTO ContactUs (name, email_id, message) VALUES (?, ?, ?)';
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error inserting into ContactUs table:', err);
            res.status(500).json({ status: 500, message: 'Failed to insert into ContactUs table' });
            return;
        }
        console.log('Inserted into ContactUs table:', result);
        res.status(200).json({ status: 200, message: 'Contact details inserted successfully' });
    });
});

app.use('/blood_donar/autenticate', autenticationRoute);
app.use('/blood_donar', bloodBankRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server connected to port ${PORT}`);
});
