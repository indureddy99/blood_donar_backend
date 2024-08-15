import { db } from "../config/dbConfig.js";
import { execQuery } from "../utils/dbUtil.js";

// Model function to create a new blood bank entry
export const createBloodBankMdl = function (bloodBankData, callback) {
    const {
        location,
        blood_type,
        amount_of_blood,
        expiry_date,
        user_id
    } = bloodBankData;

    const query = `
        INSERT INTO \`blood_bank\` (
            \`location\`,
            \`blood_type\`,
            \`amount_of_blood\`,
            \`expiry_date\`,
            \`user_id\`
        ) VALUES (
            '${location}',
            '${blood_type}',
            '${amount_of_blood}',
            '${expiry_date}',
            '${user_id}'
        )
    `;

    if (callback && typeof callback === "function") {
        execQuery(db, query, function (err, results) {
            callback(err, results);
        });
    } else {
        return execQuery(db, query);
    }
};

// Model function to get a blood bank entry by ID
export const getBloodBankByIdMdl = function (id, callback) {
    const query = `SELECT * FROM blood_bank WHERE blood_bank_id = '${id}'`;

    if (callback && typeof callback === "function") {
        execQuery(db, query, function (err, results) {
            callback(err, results);
        });
    } else {
        return execQuery(db, query);
    }
};

// Model function to update a blood bank entry
export const updateBloodBankMdl = function (id, updatedBloodBankData, callback) {
    const {
        location,
        blood_type,
        amount_of_blood,
        expiry_date,
        user_id
    } = updatedBloodBankData;

    const query = `
        UPDATE \`blood_bank\`
        SET 
            \`location\` = '${location}',
            \`blood_type\` = '${blood_type}',
            \`amount_of_blood\` = '${amount_of_blood}',
            \`expiry_date\` = '${expiry_date}',
            \`user_id\` = '${user_id}'
        WHERE 
            \`blood_bank_id\` = '${id}'
    `;

    if (callback && typeof callback === "function") {
        execQuery(db, query, function (err, results) {
            callback(err, results);
        });
    } else {
        return execQuery(db, query);
    }
};

// Model function to delete a blood bank entry
export const deleteBloodBankMdl = function (id, callback) {
    const query = `DELETE FROM \`blood_bank\` WHERE \`blood_bank_id\` = '${id}'`;

    if (callback && typeof callback === "function") {
        execQuery(db, query, function (err, results) {
            callback(err, results);
        });
    } else {
        return execQuery(db, query);
    }
};

// Model function to get all blood bank entries
export const getAllBloodBanksMdl = function (callback) {
    const query = `SELECT * FROM blood_bank`;

    if (callback && typeof callback === "function") {
        execQuery(db, query, function (err, results) {
            callback(err, results);
        });
    } else {
        return execQuery(db, query);
    }
};
