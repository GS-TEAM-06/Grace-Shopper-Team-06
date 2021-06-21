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
  let token;
  beforeEach(async () => {
    await seed();
    token = await User.authenticate({
      username: 'admin',
      password: 'admin',
    });
  });

  describe('/api/cards/', () => {
    it('GET /api/cards', async () => {
      // const res = await request(app).get('/api/users').expect(200);
      const res = await request(app)
        .get('/api/cards')
        .set({ token })
        .expect(200);

      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(3);
    });

    xit('DELETE card removes the card', () => {
      expect(false).to.equal(true);
    });
    xit('update the card', () => {
      expect(false).to.equal(true);
    });
    xit('add a new card', () => {
      expect(false).to.equal(true);
    });
  }); // end describe('/api/users')
}); // end describe('User routes')
