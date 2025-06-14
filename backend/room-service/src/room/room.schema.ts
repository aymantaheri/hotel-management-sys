import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true, unique: true })
  roomNumber: string;

  @Prop({ required: true })
  roomType: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: true })
  availability: boolean;

  @Prop()
  description: string;

  @Prop()
  amenities: string[];

  @Prop({ default: 2 })
  maxGuests: number;
}

export const RoomSchema = SchemaFactory.createForClass(Room);

