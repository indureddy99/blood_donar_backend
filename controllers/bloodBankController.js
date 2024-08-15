import {
    createBloodBankMdl,
    getBloodBankByIdMdl,
    updateBloodBankMdl,
    deleteBloodBankMdl,
    getAllBloodBanksMdl
} from '../models/bloodBankModel.js';

// Controller to create a new blood bank entry
export const createBloodBankCtrl = (req, res) => {
    const bloodBankData = {
        location: req.body.location,
        blood_type: req.body.blood_type,
        amount_of_blood: req.body.amount_of_blood,
        expiry_date: req.body.expiry_date,
        user_id: req.body.user_id
    };

    createBloodBankMdl(bloodBankData, (err, results) => {
        if (err) {
            return res.status(400).json({ status: 400, message: "Failed to create the blood bank entry" });
        }
        res.status(201).json({ status: 201, message: "Blood bank entry created successfully" });
    });
};

// Controller to get a blood bank entry by ID
export const getBloodBankByIdCtrl = (req, res) => {
    const { id } = req.params;

    getBloodBankByIdMdl(id, (err, results) => {
        if (err) {
            console.error('Error fetching blood bank entry by ID:', err);
            return res.status(500).json({ status: 500, message: 'Internal server error' });
        }

        res.status(200).json({ status: 200, data: results });
    });
};

// Controller to update a blood bank entry
export const updateBloodBankCtrl = (req, res) => {
    const { id } = req.params;
    const updatedBloodBankData = req.body;

    updateBloodBankMdl(id, updatedBloodBankData, (err, results) => {
        if (err) {
            return res.status(400).json({ status: 400, message: "Failed to update the blood bank entry" });
        }
        res.status(200).json({ status: 200, message: "Blood bank entry updated successfully" });
    });
};

// Controller to delete a blood bank entry
export const deleteBloodBankCtrl = (req, res) => {
    const { id } = req.params;

    deleteBloodBankMdl(id, (err, results) => {
        if (err) {
            return res.status(400).json({ status: 400, message: "Failed to delete the blood bank entry" });
        }
        res.status(200).json({ status: 200, message: "Blood bank entry deleted successfully" });
    });
};

// Controller to get all blood bank entries
export const getAllBloodBanksCtrl = (req, res) => {
    getAllBloodBanksMdl((err, results) => {
        if (err) {
            console.error('Error fetching all blood bank entries:', err);
            return res.status(500).json({ status: 500, message: 'Internal server error' });
        }

        res.status(200).json({ status: 200, data: results });
    });
};
