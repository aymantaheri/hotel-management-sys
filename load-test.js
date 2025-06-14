import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.1'],    // Error rate should be below 10%
  },
};

const BASE_URL = 'http://localhost:3001';

export default function () {
  // Test user registration
  let registerPayload = JSON.stringify({
    query: `
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          token
          user {
            id
            email
            firstName
            lastName
          }
        }
      }
    `,
    variables: {
      input: {
        email: `user${Math.random()}@example.com`,
        password: 'password123',
        firstName: 'Load',
        lastName: 'Test',
        phoneNumber: '1234567890',
        address: '123 Load Test St',
      },
    },
  });

  let registerResponse = http.post(`${BASE_URL}/graphql`, registerPayload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  check(registerResponse, {
    'registration status is 200': (r) => r.status === 200,
    'registration returns token': (r) => {
      const body = JSON.parse(r.body);
      return body.data && body.data.register && body.data.register.token;
    },
  });

  sleep(1);

  // Test user login
  let loginPayload = JSON.stringify({
    query: `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          token
          user {
            id
            email
          }
        }
      }
    `,
    variables: {
      input: {
        email: 'test@example.com',
        password: 'password123',
      },
    },
  });

  let loginResponse = http.post(`${BASE_URL}/graphql`, loginPayload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  check(loginResponse, {
    'login status is 200': (r) => r.status === 200,
  });

  sleep(1);
}

