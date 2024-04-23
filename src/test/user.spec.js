import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userService from '../services/user.service.js';
import User from '../database/schema/user.schema.js';

// Mocking bcrypt.compare function
/*jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

// Mocking jwt.sign function
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));*/


// Mocking bcrypt functions
jest.mock('bcrypt', () => ({
    compare: jest.fn(),
    hash: jest.fn(), // Add this line to mock the hash function
  }));
  
  // Mocking jwt.sign function
  jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
  }));

describe('userService', () => {
  describe('register', () => {
    it('should throw an error if user already exists', async () => {
      const email = 'existing@example.com';
      User.findOne = jest.fn().mockResolvedValue({ email });

      await expect(userService.register('John', 'Doe', email, 'password')).rejects.toThrow('User already exists');
    });

    it('should create a new user and return user details', async () => {
      const email = 'newuser@example.com';
      User.findOne = jest.fn().mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue({
        _id: 'userId',
        firstName: 'John',
        lastName: 'Doe',
        email,
      });

      const result = await userService.register('John', 'Doe', email, 'password');

      expect(result).toMatchObject({
        firstName: 'John',
        lastName: 'Doe',
        email,
      });
      expect(result.id).toBeDefined();
    });
  });

  describe('login', () => {
    it('should throw an error if user not found', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      await expect(userService.login('nonexistent@example.com', 'password')).rejects.toThrow('User not found');
    });

    it('should throw an error if password is invalid', async () => {
      const user = { email: 'existing@example.com', password: 'hashedPassword' };
      User.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await expect(userService.login('existing@example.com', 'wrongPassword')).rejects.toThrow('Invalid password');
    });

    it('should return user and token if login is successful', async () => {
      const user = { _id: 'userId', firstName: 'John', lastName: 'Doe', email: 'existing@example.com' };
      User.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fakeToken');

      const result = await userService.login('existing@example.com', 'password');

      expect(result).toEqual({
        user,
        token: 'fakeToken',
      });
    });
  });
});