import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface ILoan
  extends Document {
  borrowerId: mongoose.Types.ObjectId;
  amount: number;
  tenureDays: number;
  interestRate: number;
  interestAmount: number;
  totalRepayment: number;
  paidAmount: number;
  outstandingAmount: number;
  status: string;
  rejectionReason?: string;
  disbursedAt?: Date;
}

const loanSchema =
  new Schema<ILoan>(
    {
      borrowerId: {
        type:
          Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      amount: Number,
      tenureDays: Number,
      interestRate: Number,
      interestAmount: Number,
      totalRepayment: Number,

      paidAmount: {
        type: Number,
        default: 0,
      },

      outstandingAmount:
        Number,

      status: {
        type: String,
        default:
          "APPLIED",
      },

      rejectionReason:
        String,

      disbursedAt: Date,
    },
    { timestamps: true }
  );

export default mongoose.model<ILoan>(
  "Loan",
  loanSchema
);