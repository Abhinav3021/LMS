import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IPayment
  extends Document {
  loanId: mongoose.Types.ObjectId;
  utr: string;
  amount: number;
  paidAt: Date;
}

const paymentSchema =
  new Schema<IPayment>(
    {
      loanId: {
        type:
          Schema.Types.ObjectId,
        ref: "Loan",
        required: true,
      },

      utr: {
        type: String,
        required: true,
        unique: true,
      },

      amount: {
        type: Number,
        required: true,
      },

      paidAt: {
        type: Date,
        required: true,
      },
    },
    { timestamps: true }
  );

export default mongoose.model<IPayment>(
  "Payment",
  paymentSchema
);