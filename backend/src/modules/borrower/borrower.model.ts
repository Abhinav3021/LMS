import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IBorrowerProfile
  extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  pan: string;
  dob: string;
  monthlySalary: number;
  employmentMode: string;
  salarySlipUrl?: string;
}

const borrowerSchema =
  new Schema<IBorrowerProfile>(
    {
      userId: {
        type:
          Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true,
      },

      fullName: String,
      pan: String,
      dob: String,
      monthlySalary: Number,
      employmentMode: String,

      salarySlipUrl: {
        type: String,
      },
    },
    { timestamps: true }
  );

export default mongoose.model<IBorrowerProfile>(
  "BorrowerProfile",
  borrowerSchema
);