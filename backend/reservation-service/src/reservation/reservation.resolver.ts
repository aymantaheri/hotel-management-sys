import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation.types';
import { CreateReservationInput, UpdateReservationInput } from './reservation.inputs';

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(private reservationService: ReservationService) {}

  @Query(() => [Reservation])
  async reservations(): Promise<Reservation[]> {
    return this.reservationService.getAllReservations();
  }

  @Query(() => [Reservation])
  async userReservations(@Args('userId') userId: string): Promise<Reservation[]> {
    return this.reservationService.getReservationsByUserId(userId);
  }

  @Query(() => Reservation)
  async reservation(@Args('id', { type: () => ID }) id: string): Promise<Reservation> {
    return this.reservationService.getReservationById(id);
  }

  @Mutation(() => Reservation)
  async createReservation(@Args('input') createReservationInput: CreateReservationInput): Promise<Reservation> {
    return this.reservationService.createReservation(createReservationInput);
  }

  @Mutation(() => Reservation)
  async updateReservation(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateReservationInput: UpdateReservationInput,
  ): Promise<Reservation> {
    return this.reservationService.updateReservation(id, updateReservationInput);
  }

  @Mutation(() => Reservation)
  async cancelReservation(@Args('id', { type: () => ID }) id: string): Promise<Reservation> {
    return this.reservationService.cancelReservation(id);
  }
}

