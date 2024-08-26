import { db } from "../config/dbConfig.js";
import { execQuery } from "../utils/dbUtil.js";

export const loginMdl = function (signupData, callback) {
  const { userEmail } = signupData;
  const QRY_TO_EXEC = `SELECT * FROM user WHERE email = ?`;
  const values = [userEmail];

  execQuery(db, QRY_TO_EXEC, values, function (err, results) {
    if (err) {
      console.error('Error executing query:', err);  // Added logging for debugging
      return callback(err, null);
    }
    callback(null, results);
  });
};

export const createUserMdl = function (userData, callback) {
  const {
    userName,
    firstName,
    lastName,
    email,
    password,
    address,
    mobileNo,
  } = userData;

  // Queries to check for existing email and username
  const checkEmailQuery = `SELECT COUNT(*) AS emailCount FROM user WHERE email = ?`;
  const checkUsernameQuery = `SELECT COUNT(*) AS usernameCount FROM user WHERE user_name = ?`;

  // Check if the email already exists
  execQuery(db, checkEmailQuery, [email], function (err, emailResults) {
    if (err) {
      return callback(err, null);
    }
    
    const emailCount = emailResults[0].emailCount;

    // Check if the username already exists
    execQuery(db, checkUsernameQuery, [userName], function (err, usernameResults) {
      if (err) {
        return callback(err, null);
      }
      
      const usernameCount = usernameResults[0].usernameCount;

      // Handle case where email already exists
      if (emailCount > 0) {
        const emailExistsError = new Error("Email already exists");
        return callback(emailExistsError, null);
      }
      
      // Handle case where username already exists
      if (usernameCount > 0) {
        const usernameExistsError = new Error("Username already exists");
        return callback(usernameExistsError, null);
      }
      
      // Proceed to insert the new user if no existing email or username found
      const insertUserQuery = `INSERT INTO user (user_name, first_name, last_name, email, password, mobile_no, address) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const values = [userName, firstName, lastName, email, password, mobileNo, address];

      execQuery(db, insertUserQuery, values, function (err, insertResults) {
        if (err) {
          return callback(err, null);
        }
        
        // Return success response
        callback(null, insertResults);
      });
    });
  });
};
