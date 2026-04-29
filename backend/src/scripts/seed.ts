import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../modules/auth/user.model";
import { Role } from "../types/roles";

const MONGO_URI =
  process.env.MONGO_URI as string;

const PASSWORD =
  "Password@123";

const users = [
  {
    name: "Admin User",
    email:
      "admin@lms.com",
    role: Role.ADMIN,
  },
  {
    name: "Sales User",
    email:
      "sales@lms.com",
    role: Role.SALES,
  },
  {
    name: "Sanction User",
    email:
      "sanction@lms.com",
    role: Role.SANCTION,
  },
  {
    name:
      "Disbursement User",
    email:
      "disbursement@lms.com",
    role:
      Role.DISBURSEMENT,
  },
  {
    name:
      "Collection User",
    email:
      "collection@lms.com",
    role:
      Role.COLLECTION,
  },
  {
    name:
      "Borrower User",
    email:
      "borrower@lms.com",
    role:
      Role.BORROWER,
  },
];

const runSeed =
  async () => {
    try {
      await mongoose.connect(
        MONGO_URI
      );

      console.log(
        "MongoDB connected"
      );

      const hashed =
        await bcrypt.hash(
          PASSWORD,
          10
        );

      for (const item of users) {
        const exists =
          await User.findOne(
            {
              email:
                item.email,
            }
          );

        if (!exists) {
          await User.create({
            ...item,
            password:
              hashed,
          });

          console.log(
            `Created: ${item.email}`
          );
        } else {
          console.log(
            `Exists: ${item.email}`
          );
        }
      }

      console.log(
        "Seeding complete"
      );

      process.exit(0);
    } catch (error) {
      console.error(
        error
      );
      process.exit(1);
    }
  };

runSeed();
