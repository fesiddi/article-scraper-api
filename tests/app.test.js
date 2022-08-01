const app = require('../app');
const request = require('supertest');
const Website = require('../model/Website');
const { connectDB, disconnectDB } = require('../utils/dbConnection');

describe('API Endopoints Tests', () => {
    beforeAll(async () => {
        await connectDB();
        await Website.deleteMany({});
    });
    afterAll(async () => {
        await disconnectDB();
    });

    describe('GET /api/articles/:id/:keyword', () => {
        // it('Should return json with a list of articles with keyword in the title', async () => {
        //     const testUrl = '/api/websites/1/ferrari';
        //     const response = await request(app)
        //         .get(testUrl)
        //         .expect('Content-Type', /json/)
        //         .expect(200);
        // });
        // it('Should fail when invalid id is provided', () => {});
    });

    describe('POST /api/websites', () => {
        it('Should post a new website url with valid data', async () => {
            const response = await request(app)
                .post('/api/websites')
                .send({
                    url: 'http://www.ansa.it/',
                })
                .expect(201);

            expect(response.body).toEqual(
                expect.objectContaining({
                    url: 'http://www.ansa.it/',
                    id: expect.any(String),
                })
            );
        });
        it('Should fail with status code 409 when data is already present in db', async () => {
            const response = await request(app)
                .post('/api/websites')
                .send({
                    url: 'http://www.ansa.it',
                })
                .expect(409);
        });
        it('fails with status code 400 when data is not valid or missing', async () => {
            const response = await request(app)
                .post('/api/websites')
                .send({ url: '' })
                .expect(400);
        });
        it('fails with status code 404 when provided url is not existing', async () => {
            const response = await request(app)
                .post('/api/websites')
                .send({ url: 'http://www.fdsafsadfdafdafsdf.com' })
                .expect(404);
        });
    });
});
