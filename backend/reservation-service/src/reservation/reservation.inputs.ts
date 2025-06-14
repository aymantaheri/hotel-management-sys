import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateReservationInput {
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

  @Field({ nullable: true })
  specialRequests?: string;
}

@InputType()
export class UpdateReservationInput {
  @Field({ nullable: true })
  checkInDate?: Date;

  @Field({ nullable: true })
  checkOutDate?: Date;

  @Field(() => Int, { nullable: true })
  numberOfGuests?: number;

  @Field(() => Float, { nullable: true })
  totalPrice?: number;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  specialRequests?: string;
}

