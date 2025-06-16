const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true, unique: true }, 
  type: { type: String, enum: ["sedan", "suv", "hatchback", "sport" , "coupe"], required: true },
  pricePerDay: { type: Number, required: true },
  personCapacity: { type: Number, required: true },
  fuelCapacity: { type: Number, required: true },
  transmission: { type: String, enum: ["manual", "automatic"], required: true },
  availability: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Car", CarSchema);
