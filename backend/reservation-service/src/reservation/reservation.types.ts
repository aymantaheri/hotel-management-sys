import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class Reservation {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  roomId: string;

  @Field()
  checkInDate: Date;

  @Field()
  checkOutDate: Date;

  @Field(() => Int)
  numberOfGuests: number;

  @Field(() => Float)
  totalPrice: number;

  @Field()
  status: string;

  @Field({ nullable: true })
  paymentId?: string;

  @Field({ nullable: true })
  specialRequests?: string;
}

@ObjectType()
export class PaymentResult {
  @Field()
  success: boolean;

  @Field()
  paymentId: string;

  @Field({ nullable: true })
  message?: string;
}

