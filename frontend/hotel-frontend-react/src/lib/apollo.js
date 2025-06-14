import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql', // Auth service endpoint
});

export const authClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const roomHttpLink = createHttpLink({
  uri: 'http://localhost:3002/graphql', // Room service endpoint
});

export const roomClient = new ApolloClient({
  link: roomHttpLink,
  cache: new InMemoryCache(),
});

const reservationHttpLink = createHttpLink({
  uri: 'http://localhost:3003/graphql', // Reservation service endpoint
});

export const reservationClient = new ApolloClient({
  link: reservationHttpLink,
  cache: new InMemoryCache(),
});

