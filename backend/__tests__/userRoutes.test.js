import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server.js';
import User from '../model/User.js';
import { connectDB } from '../db/connection.js';

// Test user data
const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
};

const testUser2 = {
    email: 'test2@example.com',
    password: 'password456',
    name: 'Test User 2',
};

// Set up test database connection
beforeAll(async () => {
    await connectDB();
});

// Clean up test users before each test
beforeEach(async () => {
    await User.deleteMany({ email: { $in: [testUser.email, testUser2.email] } });
});

// Close database connection after all tests
afterAll(async () => {
    await User.deleteMany({ email: { $in: [testUser.email, testUser2.email] } });
    await mongoose.connection.close();
});

describe('User Registration API', () => {
    describe('POST /api/users/register', () => {
        test('should successfully register a new user with valid data', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send(testUser)
                .expect('Content-Type', /json/);

            if (response.status !== 201) {
                console.log('ERROR Response:', response.body);
            }

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User registered successfully');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user).toHaveProperty('email', testUser.email);
            expect(response.body.user).toHaveProperty('name', testUser.name);
            expect(response.body.user).not.toHaveProperty('password');
            expect(response.body).toHaveProperty('token');
            expect(typeof response.body.token).toBe('string');
        });

        test('should reject registration with duplicate email', async () => {
            // Register first user
            await request(app).post('/api/users/register').send(testUser);

            // Try to register with same email
            const response = await request(app)
                .post('/api/users/register')
                .send(testUser)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toHaveProperty('message', 'Email already register');
        });

        test('should reject registration with missing email', async () => {
            const invalidUser = {
                password: 'password123',
                name: 'Test User',
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(invalidUser)
                .expect('Content-Type', /json/)
                .expect(500);

            expect(response.body).toHaveProperty('message');
        });

        test('should reject registration with missing password', async () => {
            const invalidUser = {
                email: 'test@example.com',
                name: 'Test User',
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(invalidUser)
                .expect('Content-Type', /json/)
                .expect(500);

            expect(response.body).toHaveProperty('message');
        });

        test('should reject registration with missing name', async () => {
            const invalidUser = {
                email: 'test@example.com',
                password: 'password123',
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(invalidUser)
                .expect('Content-Type', /json/)
                .expect(500);

            expect(response.body).toHaveProperty('message');
        });

        test('should reject registration with password less than 6 characters', async () => {
            const invalidUser = {
                email: 'test@example.com',
                password: '12345',
                name: 'Test User',
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(invalidUser)
                .expect('Content-Type', /json/)
                .expect(500);

            expect(response.body).toHaveProperty('message');
        });

        test('should store password as hashed value', async () => {
            await request(app).post('/api/users/register').send(testUser);

            const user = await User.findOne({ email: testUser.email });
            expect(user.password).not.toBe(testUser.password);
            expect(user.password.length).toBeGreaterThan(20); // bcrypt hash is much longer
        });

        test('should convert email to lowercase', async () => {
            const upperCaseEmailUser = {
                ...testUser,
                email: 'TEST@EXAMPLE.COM',
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(upperCaseEmailUser)
                .expect(201);

            expect(response.body.user.email).toBe(upperCaseEmailUser.email.toLowerCase());
        });
    });
});

describe('User Login API', () => {
    describe('POST /api/users/login', () => {
        // Register a user before login tests
        beforeEach(async () => {
            await request(app).post('/api/users/register').send(testUser);
        });

        test('should successfully login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                })
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Login successful');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user).toHaveProperty('email', testUser.email);
            expect(response.body.user).toHaveProperty('name', testUser.name);
            expect(response.body.user).not.toHaveProperty('password');
            expect(response.body).toHaveProperty('token');
            expect(typeof response.body.token).toBe('string');
        });

        test('should reject login with incorrect password', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword',
                })
                .expect('Content-Type', /json/)
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Invalid credentials');
        });

        test('should reject login with non-existent email', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123',
                })
                .expect('Content-Type', /json/)
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Invalid credentials');
        });

        test('should reject login with missing email', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    password: 'password123',
                })
                .expect('Content-Type', /json/)
                .expect(401);

            expect(response.body).toHaveProperty('error');
        });

        test('should reject login with missing password', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: testUser.email,
                })
                .expect('Content-Type', /json/)
                .expect(500);

            expect(response.body).toHaveProperty('message');
        });

        test('should be case-insensitive for email login', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: testUser.email.toUpperCase(),
                    password: testUser.password,
                })
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Login successful');
        });

        test('should generate valid JWT token on login', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                })
                .expect(200);

            const token = response.body.token;
            expect(token).toBeTruthy();
            // JWT tokens have three parts separated by dots
            expect(token.split('.')).toHaveLength(3);
        });
    });
});
