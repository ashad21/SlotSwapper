import { Response } from 'express';
import Event, { EventStatus } from '../models/Event';
import { AuthRequest } from '../middleware/auth';

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find({ owner: req.user!._id }).sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { title, startTime, endTime, status } = req.body;

    const event = await Event.create({
      title,
      startTime,
      endTime,
      status: status || EventStatus.BUSY,
      owner: req.user!._id
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const event = await Event.findOne({ _id: id, owner: req.user!._id });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.status = status;
    await event.save();

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const event = await Event.findOneAndDelete({ _id: id, owner: req.user!._id });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
