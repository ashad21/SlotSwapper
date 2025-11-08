import mongoose, { Document, Schema } from 'mongoose';

export enum SwapStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface ISwapRequest extends Document {
  requester: mongoose.Types.ObjectId;
  requesterSlot: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  recipientSlot: mongoose.Types.ObjectId;
  status: SwapStatus;
  createdAt: Date;
  updatedAt: Date;
}

const swapRequestSchema = new Schema<ISwapRequest>({
  requester: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requesterSlot: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientSlot: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    enum: Object.values(SwapStatus),
    default: SwapStatus.PENDING
  }
}, {
  timestamps: true
});

// Index for efficient queries
swapRequestSchema.index({ requester: 1, status: 1 });
swapRequestSchema.index({ recipient: 1, status: 1 });

export default mongoose.model<ISwapRequest>('SwapRequest', swapRequestSchema);
