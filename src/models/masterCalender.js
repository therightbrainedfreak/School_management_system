import mongoose from "mongoose";
import { generateCalenderId } from '../utils/utils.js';

const masterCalenderSchema = new mongoose.Schema({

  bucketId: { type: String, required: true, index: true, unique: true },

  assessmentYear: { type: Number, required: true },
  assessmentMonth: { type: Number, required: true },

  monthOf: { type: String },

  days: [{
    _id: false,
    day: { type: Number, required: true },
    dayName: { type: String, required: true },
    status: {
      type: String,
      enum: ['working', 'holiday', 'weekend', 'event'],
      default: 'working'
    },
    title: { type: String, default: "" },
    isGlobal: { type: Boolean, default: true },
    note: String
  }],

  metadata: { type: Map, of: String }

}, { timestamps: true, minimize: false });

masterCalenderSchema.pre('validate', function () {
  if (this.isNew && !this.bucketId) {
    let genId = generateCalenderId();
    this.bucketId = genId;
  };
});

const masterCalender = mongoose.model('masterCalender', masterCalenderSchema);

export default masterCalender;