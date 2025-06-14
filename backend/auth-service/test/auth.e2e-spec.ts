import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication Flow', () => {
    const testUser = {
      email: 'e2e-test@example.com',
      password: 'password123',
      firstName: 'E2E',
      lastName: 'Test',
      phoneNumber: '1234567890',
      address: '123 E2E Test St',
    };

    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
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
          `,
          variables: {
            input: testUser,
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.register).toBeDefined();
          expect(res.body.data.register.token).toBeDefined();
          expect(res.body.data.register.user.email).toBe(testUser.email);
        });
    });

    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
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
          `,
          variables: {
            input: {
              email: testUser.email,
              password: testUser.password,
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.login).toBeDefined();
          expect(res.body.data.login.token).toBeDefined();
          expect(res.body.data.login.user.email).toBe(testUser.email);
        });
    });

    it('should reject login with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
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
              email: testUser.email,
              password: 'wrongpassword',
            },
          },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toContain('Invalid credentials');
        });
    });
  });
});

