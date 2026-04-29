"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../modules/auth/user.model"));
const roles_1 = require("../types/roles");
const MONGO_URI = process.env.MONGO_URI;
const PASSWORD = "Password@123";
const users = [
    {
        name: "Admin User",
        email: "admin@lms.com",
        role: roles_1.Role.ADMIN,
    },
    {
        name: "Sales User",
        email: "sales@lms.com",
        role: roles_1.Role.SALES,
    },
    {
        name: "Sanction User",
        email: "sanction@lms.com",
        role: roles_1.Role.SANCTION,
    },
    {
        name: "Disbursement User",
        email: "disbursement@lms.com",
        role: roles_1.Role.DISBURSEMENT,
    },
    {
        name: "Collection User",
        email: "collection@lms.com",
        role: roles_1.Role.COLLECTION,
    },
    {
        name: "Borrower User",
        email: "borrower@lms.com",
        role: roles_1.Role.BORROWER,
    },
];
const runSeed = async () => {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log("MongoDB connected");
        const hashed = await bcryptjs_1.default.hash(PASSWORD, 10);
        for (const item of users) {
            const exists = await user_model_1.default.findOne({
                email: item.email,
            });
            if (!exists) {
                await user_model_1.default.create({
                    ...item,
                    password: hashed,
                });
                console.log(`Created: ${item.email}`);
            }
            else {
                console.log(`Exists: ${item.email}`);
            }
        }
        console.log("Seeding complete");
        process.exit(0);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
runSeed();
