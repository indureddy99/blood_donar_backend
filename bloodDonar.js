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

// GET endpoint to fetch all contacts
app.get('/contacts', (req, res) => {
    const sql = 'SELECT * FROM ContactUs';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching from ContactUs table:', err);
            res.status(500).json({ status: 500, message: 'Failed to fetch from ContactUs table' });
            return;
        }
        console.log('Fetched from ContactUs table:', results);
        res.status(200).json({ status: 200, data: results });
    });
});

app.post('/blood-donations', (req, res) => {
    const { user_id, blood_type, amount_of_blood, donation_date, blood_bank_id, expiry_date } = req.body;
    
    // SQL query to insert a new blood donation record
    const sql = `
        INSERT INTO blood_donations (user_id, blood_type, amount_of_blood, donation_date, blood_bank_id, expiry_date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    // Execute the query
    db.query(sql, [user_id, blood_type, amount_of_blood, donation_date, blood_bank_id, expiry_date], (err, result) => {
        if (err) {
            console.error('Error inserting into blood_donations table:', err);
            res.status(500).json({ status: 500, message: 'Failed to insert into blood_donations table' });
            return;
        }
        console.log('Inserted into blood_donations table:', result);
        res.status(200).json({ status: 200, message: 'Blood donation record inserted successfully' });
    });
});

// update status for blood donation bookings
app.put('/blood-donations/:donation_id/status', (req, res) => {
    const { donation_id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ status: 400, message: 'Status is required' });
    }

    const sql = 'UPDATE blood_donations SET status = ? WHERE donation_id = ?';
    db.query(sql, [status, donation_id], (err, result) => {
        if (err) {
            console.error('Error updating status:', err);
            return res.status(500).json({ status: 500, message: 'Failed to update status' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 404, message: 'Donation ID not found' });
        }
        res.status(200).json({ status: 200, message: 'Status updated successfully' });
    });
});


// Create a new blood request
app.post('/blood-requests', (req, res) => {
    const { blood_bank_id, user_id, blood_type, amount_needed, request_date } = req.body;

    if (!user_id) {
        return res.status(400).json({ status: 400, message: 'User ID is required' });
    }

    const sql = 'INSERT INTO blood_requests (blood_bank_id, user_id, blood_type, amount_needed, request_date) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [blood_bank_id, user_id, blood_type, amount_needed, request_date], (err, result) => {
        if (err) {
            console.error('Error creating blood request:', err);
            return res.status(500).json({ status: 500, message: 'Failed to create blood request' });
        }
        res.status(201).json({ status: 201, message: 'Blood request created successfully', request_id: result.insertId });
    });
});

// Update the status of a blood request
app.put('/blood-requests/:request_id/status', (req, res) => {
    const { request_id } = req.params;
    const { status, fulfillment_date } = req.body;

    if (!status) {
        return res.status(400).json({ status: 400, message: 'Status is required' });
    }

    const sql = 'UPDATE blood_requests SET status = ?, fulfillment_date = ? WHERE request_id = ?';
    db.query(sql, [status, fulfillment_date || null, request_id], (err, result) => {
        if (err) {
            console.error('Error updating blood request status:', err);
            return res.status(500).json({ status: 500, message: 'Failed to update blood request status' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 404, message: 'Request ID not found' });
        }
        res.status(200).json({ status: 200, message: 'Blood request status updated successfully' });
    });
});


// Fetch blood requests
app.get('/blood-requests', (req, res) => {
    const query = `SELECT * FROM blood_requests`;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching blood requests:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ status: 200, data: results });
    });
});

// Fetch blood requests by user_id
app.get('/blood-requests/:user_id', (req, res) => {
    const { user_id } = req.params;
    const query = `SELECT * FROM blood_requests WHERE user_id = ?`;
    
    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching blood requests by user_id:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ status: 200, data: results });
    });
});

// Fetch blood donations
app.get('/blood-donations', (req, res) => {
    const query = `SELECT *FROM blood_donations`;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching blood donations:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ status: 200, data: results });
    });
});
// Fetch blood donations by user_id
app.get('/blood-donations/:user_id', (req, res) => {
    const { user_id } = req.params;
    const query = `SELECT * FROM blood_donations WHERE user_id = ?`;
    
    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching blood donations by user_id:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ status: 200, data: results });
    });
});


app.use('/blood_donar/autenticate', autenticationRoute);
app.use('/blood_donar', bloodBankRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server connected to port ${PORT}`);
});
