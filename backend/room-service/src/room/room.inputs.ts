import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateRoomInput {
  @Field()
  roomNumber: string;

  @Field()
  roomType: string;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  amenities?: string[];

  @Field(() => Int, { defaultValue: 2 })
  maxGuests: number;
}

@InputType()
export class UpdateRoomInput {
  @Field({ nullable: true })
  roomType?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field({ nullable: true })
  availability?: boolean;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  amenities?: string[];

  @Field(() => Int, { nullable: true })
  maxGuests?: number;
}

