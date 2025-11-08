import { Response } from 'express';
import mongoose from 'mongoose';
import Event, { EventStatus } from '../models/Event';
import SwapRequest, { SwapStatus } from '../models/SwapRequest';
import { AuthRequest } from '../middleware/auth';

export const getSwappableSlots = async (req: AuthRequest, res: Response) => {
  try {
    // Get all swappable slots from other users (exclude logged-in user's own slots)
    const swappableSlots = await Event.find({
      status: EventStatus.SWAPPABLE,
      owner: { $ne: req.user!._id }
    })
      .populate('owner', 'name email')
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: swappableSlots.length,
      data: swappableSlots
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

export const createSwapRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { mySlotId, theirSlotId } = req.body;
    const userId = req.user?.id;

    if (!mySlotId || !theirSlotId) {
      return res.status(400).json({ message: 'Both slot IDs are required' });
    }

    // Verify my slot
    const mySlot = await Event.findOne({ _id: mySlotId, owner: userId });
    if (!mySlot || mySlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ message: 'Your slot must be swappable' });
    }

    // Verify their slot
    const theirSlot = await Event.findById(theirSlotId);
    if (!theirSlot || theirSlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ message: 'Selected slot is not available' });
    }

    if (theirSlot.owner.toString() === userId) {
      return res.status(400).json({ message: 'Cannot swap with your own slot' });
    }

    // Check for existing pending request
    const existingRequest = await SwapRequest.findOne({
      $or: [
        { requester: userId, requesterSlot: mySlotId, recipientSlot: theirSlotId },
        { requester: theirSlot.owner, requesterSlot: theirSlotId, recipientSlot: mySlotId }
      ],
      status: 'PENDING'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'A swap request already exists for these slots' });
    }

    // Update slot statuses
    mySlot.status = EventStatus.SWAP_PENDING;
    theirSlot.status = EventStatus.SWAP_PENDING;
    await mySlot.save();
    await theirSlot.save();

    // Create swap request
    const swapRequest = await SwapRequest.create({
      requester: userId,
      requesterSlot: mySlotId,
      recipient: theirSlot.owner,
      recipientSlot: theirSlotId,
      status: 'PENDING'
    });

    // Populate the swap request
    const populatedRequest = await SwapRequest.findById(swapRequest._id)
      .populate('requester', 'name email')
      .populate('recipient', 'name email')
      .populate('requesterSlot')
      .populate('recipientSlot');

    // Emit socket event
    const io = req.app.get('io');
    io.to(theirSlot.owner.toString()).emit('swap-request', populatedRequest);

    res.status(201).json({
      message: 'Swap request created successfully',
      data: populatedRequest
    });
  } catch (error) {
    console.error('Create swap request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const respondToSwapRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { requestId } = req.params;
    const { accept } = req.body;

    const swapRequest = await SwapRequest.findById(requestId)
      .populate('requesterSlot')
      .populate('recipientSlot');

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Verify the user is the recipient
    if (swapRequest.recipient.toString() !== (req.user!._id as any).toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this swap request'
      });
    }

    // Verify request is still pending
    if (swapRequest.status !== SwapStatus.PENDING) {
      return res.status(400).json({
        success: false,
        message: 'This swap request has already been processed'
      });
    }

    const requesterSlot = await Event.findById(swapRequest.requesterSlot);
    const recipientSlot = await Event.findById(swapRequest.recipientSlot);

    if (!requesterSlot || !recipientSlot) {
      return res.status(404).json({
        success: false,
        message: 'One or both slots no longer exist'
      });
    }

    if (accept) {
      // ACCEPT: Swap the owners
      const tempOwner = requesterSlot.owner;
      requesterSlot.owner = recipientSlot.owner;
      recipientSlot.owner = tempOwner;

      // Set both slots back to BUSY
      requesterSlot.status = EventStatus.BUSY;
      recipientSlot.status = EventStatus.BUSY;

      await requesterSlot.save();
      await recipientSlot.save();

      swapRequest.status = SwapStatus.ACCEPTED;
    } else {
      // REJECT: Set both slots back to SWAPPABLE
      requesterSlot.status = EventStatus.SWAPPABLE;
      recipientSlot.status = EventStatus.SWAPPABLE;

      await requesterSlot.save();
      await recipientSlot.save();

      swapRequest.status = SwapStatus.REJECTED;
    }

    await swapRequest.save();

    const populatedSwapRequest = await SwapRequest.findById(swapRequest._id)
      .populate('requester', 'name email')
      .populate('recipient', 'name email')
      .populate('requesterSlot')
      .populate('recipientSlot');

    // Emit socket event
    const io = req.app.get('io');
    io.to(swapRequest.requester.toString()).emit('swap-response', populatedSwapRequest);

    res.status(200).json({
      success: true,
      data: populatedSwapRequest
    });
  } catch (error: any) {
    console.error('Respond to swap error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

export const getMySwapRequests = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.query;

    let query: any = {};

    if (type === 'incoming') {
      query.recipient = req.user!._id;
    } else if (type === 'outgoing') {
      query.requester = req.user!._id;
    } else {
      // Get both incoming and outgoing
      query.$or = [
        { recipient: req.user!._id },
        { requester: req.user!._id }
      ];
    }

    const swapRequests = await SwapRequest.find(query)
      .populate('requester', 'name email')
      .populate('recipient', 'name email')
      .populate('requesterSlot')
      .populate('recipientSlot')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: swapRequests.length,
      data: swapRequests
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

export const cancelSwapRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { requestId } = req.params;

    // Find the swap request
    const swapRequest = await SwapRequest.findById(requestId);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Only the requester can cancel their own request
    if (swapRequest.requester.toString() !== (req.user!._id as any).toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own swap requests'
      });
    }

    // Only pending requests can be cancelled
    if (swapRequest.status !== SwapStatus.PENDING) {
      return res.status(400).json({
        success: false,
        message: 'Only pending requests can be cancelled'
      });
    }

    // Revert both events back to SWAPPABLE status
    await Event.findByIdAndUpdate(swapRequest.requesterSlot, {
      status: EventStatus.SWAPPABLE
    });

    await Event.findByIdAndUpdate(swapRequest.recipientSlot, {
      status: EventStatus.SWAPPABLE
    });

    // Delete the swap request
    await SwapRequest.findByIdAndDelete(requestId);

    res.status(200).json({
      success: true,
      message: 'Swap request cancelled successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
