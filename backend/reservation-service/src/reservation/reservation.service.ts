import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { Reservation, ReservationDocument } from './reservation.schema';
import { CreateReservationInput, UpdateReservationInput } from './reservation.inputs';
import { PaymentService } from './payment.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
    private paymentService: PaymentService,
  ) {}

  async createReservation(createReservationInput: CreateReservationInput): Promise<Reservation> {
    const { roomId, userId, totalPrice, ...reservationData } = createReservationInput;

    // Check room availability by calling Room Service
    try {
      const roomResponse = await axios.get(`http://localhost:3002/graphql`, {
        data: {
          query: `
            query GetRoom($id: ID!) {
              room(id: $id) {
                id
                availability
                price
              }
            }
          `,
          variables: { id: roomId }
        }
      });

      const room = roomResponse.data?.data?.room;
      if (!room || !room.availability) {
        throw new HttpException('Room is not available', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      // For demo purposes, we'll continue even if room service is not available
      console.warn('Could not verify room availability:', error.message);
    }

    // Process payment
    const paymentResult = await this.paymentService.processPayment(totalPrice, userId);
    
    if (!paymentResult.success) {
      throw new HttpException(paymentResult.message || 'Payment failed', HttpStatus.PAYMENT_REQUIRED);
    }

    // Create reservation
    const reservation = new this.reservationModel({
      ...createReservationInput,
      paymentId: paymentResult.paymentId,
      status: 'confirmed',
    });

    await reservation.save();

    // Update room availability (in a real scenario, this would be done via Kafka)
    try {
      await axios.post(`http://localhost:3002/graphql`, {
        query: `
          mutation UpdateRoomAvailability($id: ID!, $availability: Boolean!) {
            updateRoomAvailability(id: $id, availability: $availability) {
              id
              availability
            }
          }
        `,
        variables: { id: roomId, availability: false }
      });
    } catch (error) {
      console.warn('Could not update room availability:', error.message);
    }

    return {
      id: reservation._id.toString(),
      userId: reservation.userId,
      roomId: reservation.roomId,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      numberOfGuests: reservation.numberOfGuests,
      totalPrice: reservation.totalPrice,
      status: reservation.status,
      paymentId: reservation.paymentId,
      specialRequests: reservation.specialRequests,
    };
  }

  async getAllReservations(): Promise<Reservation[]> {
    const reservations = await this.reservationModel.find();
    return reservations.map(reservation => ({
      id: reservation._id.toString(),
      userId: reservation.userId,
      roomId: reservation.roomId,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      numberOfGuests: reservation.numberOfGuests,
      totalPrice: reservation.totalPrice,
      status: reservation.status,
      paymentId: reservation.paymentId,
      specialRequests: reservation.specialRequests,
    }));
  }

  async getReservationsByUserId(userId: string): Promise<Reservation[]> {
    const reservations = await this.reservationModel.find({ userId });
    return reservations.map(reservation => ({
      id: reservation._id.toString(),
      userId: reservation.userId,
      roomId: reservation.roomId,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      numberOfGuests: reservation.numberOfGuests,
      totalPrice: reservation.totalPrice,
      status: reservation.status,
      paymentId: reservation.paymentId,
      specialRequests: reservation.specialRequests,
    }));
  }

  async getReservationById(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(id);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    return {
      id: reservation._id.toString(),
      userId: reservation.userId,
      roomId: reservation.roomId,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      numberOfGuests: reservation.numberOfGuests,
      totalPrice: reservation.totalPrice,
      status: reservation.status,
      paymentId: reservation.paymentId,
      specialRequests: reservation.specialRequests,
    };
  }

  async updateReservation(id: string, updateReservationInput: UpdateReservationInput): Promise<Reservation> {
    const reservation = await this.reservationModel.findByIdAndUpdate(
      id,
      updateReservationInput,
      { new: true }
    );

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    return {
      id: reservation._id.toString(),
      userId: reservation.userId,
      roomId: reservation.roomId,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      numberOfGuests: reservation.numberOfGuests,
      totalPrice: reservation.totalPrice,
      status: reservation.status,
      paymentId: reservation.paymentId,
      specialRequests: reservation.specialRequests,
    };
  }

  async cancelReservation(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(id);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.status === 'cancelled') {
      throw new Error('Reservation is already cancelled');
    }

    // Process refund if payment was made
    if (reservation.paymentId) {
      const refundResult = await this.paymentService.refundPayment(reservation.paymentId);
      if (!refundResult.success) {
        throw new HttpException(refundResult.message || 'Refund failed', HttpStatus.BAD_REQUEST);
      }
    }

    // Update reservation status
    reservation.status = 'cancelled';
    await reservation.save();

    // Make room available again
    try {
      await axios.post(`http://localhost:3002/graphql`, {
        query: `
          mutation UpdateRoomAvailability($id: ID!, $availability: Boolean!) {
            updateRoomAvailability(id: $id, availability: $availability) {
              id
              availability
            }
          }
        `,
        variables: { id: reservation.roomId, availability: true }
      });
    } catch (error) {
      console.warn('Could not update room availability:', error.message);
    }

    return {
      id: reservation._id.toString(),
      userId: reservation.userId,
      roomId: reservation.roomId,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      numberOfGuests: reservation.numberOfGuests,
      totalPrice: reservation.totalPrice,
      status: reservation.status,
      paymentId: reservation.paymentId,
      specialRequests: reservation.specialRequests,
    };
  }
}

