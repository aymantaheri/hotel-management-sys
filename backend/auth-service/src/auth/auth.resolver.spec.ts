import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with correct parameters', async () => {
      const registerInput = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        address: '123 Test St',
      };

      const expectedResult = {
        token: 'mockToken',
        user: {
          id: 'mockUserId',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'customer',
        },
      };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await resolver.register(registerInput);

      expect(authService.register).toHaveBeenCalledWith(registerInput);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      const loginInput = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResult = {
        token: 'mockToken',
        user: {
          id: 'mockUserId',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'customer',
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await resolver.login(loginInput);

      expect(authService.login).toHaveBeenCalledWith(loginInput);
      expect(result).toEqual(expectedResult);
    });
  });
});

