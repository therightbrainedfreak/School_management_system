import mongoose from 'mongoose';

const accountHistorySchema = new mongoose.Schema({
  targetId: {type: String, required: true, refPath: 'onModel'},
  onModel: {type: String, required: true, enum: ['admin', 'superuser']},
  performedBy: {type: String, required: true, refPath: 'performerModel'},
  performerModel: {type: String, required: true, enum: ['admin', 'superuser']},
  action: String,
  reason: String,
  timestamp: { type: Date, default: Date.now }
});

const accountHistory = mongoose.model('accountHistory', accountHistorySchema);

export default accountHistory;