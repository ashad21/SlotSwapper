import mongoose, { Document, Schema } from 'mongoose';

export enum EventStatus {
  BUSY = 'BUSY',
  SWAPPABLE = 'SWAPPABLE',
  SWAP_PENDING = 'SWAP_PENDING'
}

export interface IEvent extends Document {
  title: string;
  startTime: Date;
  endTime: Date;
  status: EventStatus;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  startTime: {
    type: Date,
    required: [true, 'Please provide a start time']
  },
  endTime: {
    type: Date,
    required: [true, 'Please provide an end time'],
    validate: {
      validator: function(this: IEvent, value: Date) {
        return value > this.startTime;
      },
      message: 'End time must be after start time'
    }
  },
  status: {
    type: String,
    enum: Object.values(EventStatus),
    default: EventStatus.BUSY
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
eventSchema.index({ owner: 1, startTime: 1 });
eventSchema.index({ status: 1 });

export default mongoose.model<IEvent>('Event', eventSchema);
