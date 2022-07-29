const app = require('../app');
const request = require('supertest');
const { response } = require('../app');

describe('API Endopoints Tests', () => {
    beforeAll(() => {});
    afterAll(() => {});

    describe('GET /api/articles/4/ferrari', () => {
        it('Should return json with a list of articles with ferrari keyword in the title', async () => {
            try {
                const response = await request(app)
                    .get('/api/websites/1/ferrari')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect(response.body)
                    .toEqual(
                        expectArrayContaining([
                            expect.objectContaining({
                                title: expect.any(String),
                                articleUrl: expect.any(Url),
                            }),
                        ])
                    );
            } catch (err) {
                return console.error(err);
            }
        });
    });

    describe('GET /api/websites', () => {
        it('Should return a json with a list of all valid websites in the DB', async () => {
            try {
                const response = await request(app)
                    .get('/api/websites')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(response.body)
                    .toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                _id: expect.any(String),
                                websiteUrl: expect.any(Url),
                            }),
                        ])
                    );
            } catch (err) {
                return console.error(err);
            }
        });
    });

    describe('POST /api/websites', () => {
        it('Should post a new website in the websites DB and return a json', async () => {
            try {
                const response = await (
                    await request(app).post('/api/websites')
                )
                    .send({
                        websiteUrl: 'http://www.ansa.it',
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect(response.body)
                    .toEqual(
                        expect.objectContaining({
                            _id: expect.any(String),
                            websiteUrl: expect.any(Url),
                        })
                    );
            } catch (err) {
                return console.error(err);
            }
        });
    });
});
