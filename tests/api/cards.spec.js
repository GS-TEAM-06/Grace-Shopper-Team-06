/* global describe beforeEach it */

const { expect } = require('chai');
const request = require('supertest');
const { db } = require('../../server/db');
// models: { Cards },
const Cards = require('../../server/db/models/Cards');
const User = require('../../server/db/models/user');
const seed = require('../../script/seed');
const app = require('../../server/app');

describe('Card routes', () => {
  let token, testCard;
  beforeEach(async () => {
    await seed();
    token = await User.authenticate({
      username: 'admin',
      password: 'admin',
    });
    testCard = await Cards.create({
      name: 'test',
      imageUrl: 'test',
      price: 0,
      description: 'test',
      quantity: 0,
      category: 'test',
    });
  });

  afterEach(async () => {
    await testCard.destroy();
  });

  describe('/api/cards/', () => {
    it('GET /api/cards', async () => {
      // const res = await request(app).get('/api/users').expect(200);
      const res = await request(app)
        .get('/api/cards')
        // .set({ token })
        .expect(200);

      expect(res.body).to.be.an('array');

      expect(res.body.length).to.equal(await Cards.count());
    });

    it('DELETE /api/cards/id protected by admin login', async () => {
      const res = await request(app)
        .delete(`/api/cards/${testCard.id}`)
        .expect(401);

      expect(res.body).to.deep.equal({});
    });

    it('DELETE /api/cards/id removes the card', async () => {
      let res = await request(app)
        .delete(`/api/cards/${testCard.id}`)
        .set({ token })
        .expect(200);

      let deletedCard = await Cards.findByPk(testCard.id);
      expect(deletedCard).to.equal(null);

      await request(app).get(`/api/cards/${testCard.id}`).expect(404);
    });

    it('PUT /api/cards/id protected by admin login', async () => {
      const res = await request(app)
        .put(`/api/cards/${testCard.id}`)
        .send({
          name: 'testUpdate',
          imageUrl: 'testUpdate',
          price: 10,
          description: 'testUpdate',
          quantity: 10,
          category: 'testUpdate',
        })
        .expect(401);

      expect(res.body).to.deep.equal({});
    });

    it('PUT /api/cards/id with admin login updates the card', async () => {
      const res = await request(app)
        .put(`/api/cards/${testCard.id}`)
        .set({ token })
        .send({
          name: 'testUpdate',
          imageUrl: 'testUpdate',
          price: 10,
          description: 'testUpdate',
          quantity: 10,
          category: 'testUpdate',
        })
        .expect(200);

      expect(res.body.name).to.equal('testUpdate');

      const updatedCard = await Cards.findByPk(testCard.id);

      expect(updatedCard.name).to.equal('testUpdate');
    });

    it('POST /api/cards/id protected by admin login', async () => {
      const res = await request(app)
        .post(`/api/cards/`)
        .send({
          name: 'testNew',
          imageUrl: 'testNew',
          price: 10,
          description: 'testNew',
          quantity: 10,
          category: 'testNew',
        })
        .expect(401);

      expect(res.body).to.deep.equal({});
    });

    it('POST /api/cards/id with admin login updates the card', async () => {
      const res = await request(app)
        .post(`/api/cards/`)
        .set({ token })
        .send({
          name: 'testNew',
          imageUrl: 'testNew',
          price: 10,
          description: 'testNew',
          quantity: 10,
          category: 'testNew',
        })
        .expect(200);

      expect(res.body.name).to.equal('testNew');

      const newCard = await Cards.findByPk(res.body.id);

      expect(newCard.name).to.equal('testNew');
    });
  }); // end describe('/api/users')
}); // end describe('User routes')
