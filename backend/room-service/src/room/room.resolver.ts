import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { RoomService } from './room.service';
import { Room } from './room.types';
import { CreateRoomInput, UpdateRoomInput } from './room.inputs';

@Resolver(() => Room)
export class RoomResolver {
  constructor(private roomService: RoomService) {}

  @Query(() => [Room])
  async rooms(): Promise<Room[]> {
    return this.roomService.getAllRooms();
  }

  @Query(() => [Room])
  async availableRooms(): Promise<Room[]> {
    return this.roomService.getAvailableRooms();
  }

  @Query(() => Room)
  async room(@Args('id', { type: () => ID }) id: string): Promise<Room> {
    return this.roomService.getRoomById(id);
  }

  @Mutation(() => Room)
  async createRoom(@Args('input') createRoomInput: CreateRoomInput): Promise<Room> {
    return this.roomService.createRoom(createRoomInput);
  }

  @Mutation(() => Room)
  async updateRoom(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateRoomInput: UpdateRoomInput,
  ): Promise<Room> {
    return this.roomService.updateRoom(id, updateRoomInput);
  }

  @Mutation(() => Boolean)
  async deleteRoom(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.roomService.deleteRoom(id);
  }

  @Mutation(() => Room)
  async updateRoomAvailability(
    @Args('id', { type: () => ID }) id: string,
    @Args('availability') availability: boolean,
  ): Promise<Room> {
    return this.roomService.updateRoomAvailability(id, availability);
  }
}

