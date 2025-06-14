import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class Room {
  @Field(() => ID)
  id: string;

  @Field()
  roomNumber: string;

  @Field()
  roomType: string;

  @Field(() => Float)
  price: number;

  @Field()
  availability: boolean;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  amenities?: string[];

  @Field(() => Int)
  maxGuests: number;
}

