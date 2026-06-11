import request from 'supertest';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import app from '../server.js';
import Cafe from '../models/Cafe.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

describe('Cafe and review protected flow', () => {
  const adminEmail = 'admin-flow@example.com';
  const client = {
    name: 'Cliente Cafe',
    email: 'client-flow@example.com',
    password: 'Password1234'
  };

  let adminCookie;
  let clientCookie;
  let cafeId;
  let reviewId;

  beforeAll(async () => {
    await Promise.all([
      User.deleteMany({ email: { $in: [adminEmail, client.email] } }),
      Cafe.deleteMany({ name: /Cafe Test Flow/ }),
      Review.deleteMany({ comment: /test flow/i })
    ]);

    await User.create({
      name: 'Admin Cafe',
      email: adminEmail,
      password: await bcryptjs.hash('Password1234', 10),
      role: 'admin'
    });

    const adminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: adminEmail, password: 'Password1234' })
      .expect(200);
    adminCookie = adminLogin.headers['set-cookie'];

    const clientRegister = await request(app)
      .post('/api/v1/auth/register')
      .send(client)
      .expect(201);
    clientCookie = clientRegister.headers['set-cookie'];
  });

  afterAll(async () => {
    await Promise.all([
      User.deleteMany({ email: { $in: [adminEmail, client.email] } }),
      Cafe.deleteMany({ name: /Cafe Test Flow/ }),
      Review.deleteMany({ comment: /test flow/i })
    ]);
    await mongoose.connection.close();
  });

  it('should list cafes publicly', async () => {
    const response = await request(app)
      .get('/api/v1/cafes')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should protect cafe CRUD and allow admin management', async () => {
    await request(app)
      .post('/api/v1/cafes')
      .send({
        name: 'Cafe Test Flow Unauthorized',
        brand: 'CafeHub',
        description: 'Intento sin permisos',
        origin: 'Colombia',
        roast: 'Medio',
        price: 12,
        imageUrl: 'https://example.com/cafe.jpg'
      })
      .expect(401);

    const createResponse = await request(app)
      .post('/api/v1/cafes')
      .set('Cookie', adminCookie)
      .send({
        name: 'Cafe Test Flow',
        brand: 'CafeHub',
        description: 'Cafe creado por prueba de integracion',
        origin: 'Colombia',
        roast: 'Medio',
        price: 15.5,
        imageUrl: 'https://example.com/cafe.jpg'
      })
      .expect(201);

    cafeId = createResponse.body.data._id;
    expect(createResponse.body.data.name).toBe('Cafe Test Flow');

    const updateResponse = await request(app)
      .put(`/api/v1/cafes/${cafeId}`)
      .set('Cookie', adminCookie)
      .send({
        name: 'Cafe Test Flow Updated',
        brand: 'CafeHub',
        description: 'Cafe actualizado por prueba de integracion',
        origin: 'Colombia',
        roast: 'Oscuro',
        price: 18,
        imageUrl: 'https://example.com/cafe-updated.jpg'
      })
      .expect(200);

    expect(updateResponse.body.data.roast).toBe('Oscuro');
  });

  it('should let an authenticated client create, update and delete a review', async () => {
    const reviewResponse = await request(app)
      .post(`/api/v1/cafes/${cafeId}/reviews`)
      .set('Cookie', clientCookie)
      .send({ rating: 5, comment: 'review test flow inicial' })
      .expect(201);

    expect(reviewResponse.body.data.cafe.rating).toBe(5);
    expect(reviewResponse.body.data.user.points).toBe(10);
    reviewId = reviewResponse.body.data.cafe.reviews[0]._id;

    const myReviews = await request(app)
      .get('/api/v1/reviews/mine')
      .set('Cookie', clientCookie)
      .expect(200);

    expect(myReviews.body.data).toHaveLength(1);

    const updateReview = await request(app)
      .put(`/api/v1/reviews/${reviewId}`)
      .set('Cookie', clientCookie)
      .send({ rating: 4, comment: 'review test flow editada' })
      .expect(200);

    expect(updateReview.body.data.rating).toBe(4);

    await request(app)
      .delete(`/api/v1/reviews/${reviewId}`)
      .set('Cookie', clientCookie)
      .expect(200);
  });

  it('should let admin delete the cafe', async () => {
    await request(app)
      .delete(`/api/v1/cafes/${cafeId}`)
      .set('Cookie', adminCookie)
      .expect(200);
  });
});
