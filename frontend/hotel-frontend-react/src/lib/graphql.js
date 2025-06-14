import { gql } from '@apollo/client';

// Auth mutations
export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      role
    }
  }
`;

// Room queries
export const GET_ROOMS_QUERY = gql`
  query GetRooms {
    rooms {
      id
      roomNumber
      roomType
      price
      availability
      description
      amenities
      maxGuests
    }
  }
`;

export const GET_AVAILABLE_ROOMS_QUERY = gql`
  query GetAvailableRooms {
    availableRooms {
      id
      roomNumber
      roomType
      price
      availability
      description
      amenities
      maxGuests
    }
  }
`;

export const CREATE_ROOM_MUTATION = gql`
  mutation CreateRoom($input: CreateRoomInput!) {
    createRoom(input: $input) {
      id
      roomNumber
      roomType
      price
      availability
      description
      amenities
      maxGuests
    }
  }
`;

// Reservation mutations and queries
export const CREATE_RESERVATION_MUTATION = gql`
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      id
      userId
      roomId
      checkInDate
      checkOutDate
      numberOfGuests
      totalPrice
      status
      paymentId
      specialRequests
    }
  }
`;

export const GET_USER_RESERVATIONS_QUERY = gql`
  query GetUserReservations($userId: String!) {
    userReservations(userId: $userId) {
      id
      userId
      roomId
      checkInDate
      checkOutDate
      numberOfGuests
      totalPrice
      status
      paymentId
      specialRequests
    }
  }
`;

export const CANCEL_RESERVATION_MUTATION = gql`
  mutation CancelReservation($id: ID!) {
    cancelReservation(id: $id) {
      id
      status
    }
  }
`;

