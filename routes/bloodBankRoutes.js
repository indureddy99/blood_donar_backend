import express from "express";
import {
    createBloodBankCtrl,
    getBloodBankByIdCtrl,
    updateBloodBankCtrl,
    deleteBloodBankCtrl,
    getAllBloodBanksCtrl
} from '../controllers/bloodBankController.js';


const route = express.Router();

// Route to create a new blood bank entry
route.post("/inventory", createBloodBankCtrl);

// Route to get a blood bank entry by ID
route.get("/inventory/:id", getBloodBankByIdCtrl);

// Route to update a blood bank entry
route.put("/inventory/:id", updateBloodBankCtrl);

// Route to delete a blood bank entry
route.delete("/inventory/:id", deleteBloodBankCtrl);

// Route to get all blood bank entries
route.get("/inventorys", getAllBloodBanksCtrl);

export default route;
