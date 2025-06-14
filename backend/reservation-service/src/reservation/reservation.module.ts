import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationService } from './reservation.service';
import { ReservationResolver } from './reservation.resolver';
import { PaymentService } from './payment.service';
import { Reservation, ReservationSchema } from './reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reservation.name, schema: ReservationSchema }]),
  ],
  providers: [ReservationService, ReservationResolver, PaymentService],
  exports: [ReservationService],
})
export class ReservationModule {}

