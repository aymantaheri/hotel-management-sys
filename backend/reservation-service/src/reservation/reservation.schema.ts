import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  roomId: string;

  @Prop({ required: true })
  checkInDate: Date;

  @Prop({ required: true })
  checkOutDate: Date;

  @Prop({ required: true })
  numberOfGuests: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' })
  status: string;

  @Prop()
  paymentId: string;

  @Prop()
  specialRequests: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

