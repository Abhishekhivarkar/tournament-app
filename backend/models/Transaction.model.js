import mongoose from "mongoose"


const transactionSchema = mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  type:{
    type:String,
    enum:["DEPOSIT","WITHDRAW","REFUND","ENTRY_FEE","WIN"],
    required:true
  },
  amount:{
    type:Number,
    required:true,
    min:0
  },
  status:{
    type:String,
    enum:["PENDING","SUCCESS","FAILED"],
    default:"PENDING"
  },
  paymentGateway:{
    type:String,
    enum:["RAZORPAY"],
    default:"RAZORPAY"
  },
  razorpayOrderId:{
    type:String
  },
  razorpayPaymentId:{
    type:String
  },
  razorpaySignature:{
    type:String
  },
  tournament:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Tournament"
  },
  notes:{
    type:String
  }
},
{timestamps:true}
)

export default mongoose.model("Transaction",transactionSchema)