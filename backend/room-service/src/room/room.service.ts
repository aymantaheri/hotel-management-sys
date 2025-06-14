import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './room.schema';
import { CreateRoomInput, UpdateRoomInput } from './room.inputs';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async createRoom(createRoomInput: CreateRoomInput): Promise<Room> {
    const room = new this.roomModel(createRoomInput);
    await room.save();
    
    return {
      id: room._id.toString(),
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.price,
      availability: room.availability,
      description: room.description,
      amenities: room.amenities,
      maxGuests: room.maxGuests,
    };
  }

  async getAllRooms(): Promise<Room[]> {
    const rooms = await this.roomModel.find();
    return rooms.map(room => ({
      id: room._id.toString(),
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.price,
      availability: room.availability,
      description: room.description,
      amenities: room.amenities,
      maxGuests: room.maxGuests,
    }));
  }

  async getAvailableRooms(): Promise<Room[]> {
    const rooms = await this.roomModel.find({ availability: true });
    return rooms.map(room => ({
      id: room._id.toString(),
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.price,
      availability: room.availability,
      description: room.description,
      amenities: room.amenities,
      maxGuests: room.maxGuests,
    }));
  }

  async getRoomById(id: string): Promise<Room> {
    const room = await this.roomModel.findById(id);
    if (!room) {
      throw new Error('Room not found');
    }

    return {
      id: room._id.toString(),
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.price,
      availability: room.availability,
      description: room.description,
      amenities: room.amenities,
      maxGuests: room.maxGuests,
    };
  }

  async updateRoom(id: string, updateRoomInput: UpdateRoomInput): Promise<Room> {
    const room = await this.roomModel.findByIdAndUpdate(
      id,
      updateRoomInput,
      { new: true }
    );

    if (!room) {
      throw new Error('Room not found');
    }

    return {
      id: room._id.toString(),
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.price,
      availability: room.availability,
      description: room.description,
      amenities: room.amenities,
      maxGuests: room.maxGuests,
    };
  }

  async deleteRoom(id: string): Promise<boolean> {
    const result = await this.roomModel.findByIdAndDelete(id);
    return !!result;
  }

  async updateRoomAvailability(id: string, availability: boolean): Promise<Room> {
    return this.updateRoom(id, { availability });
  }
}

