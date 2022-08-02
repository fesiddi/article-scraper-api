const app = require('../app');
const request = require('supertest');
const Website = require('../model/Website');
const { connectDB, disconnectDB } = require('../utils/dbConnection');
const { extractArticlesFromHtml } = require('../controllers/getArticles');

describe('API Endopoints Tests', () => {
    beforeAll(async () => {
        await connectDB();
        await Website.deleteMany({});
    });
    afterAll(async () => {
        await disconnectDB();
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
                    name: 'ansa',
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

    describe('GET /api/articles/:siteName/:keyword', () => {
        it('Should return with 200 if siteName is in db and a keyword is provided', async () => {
            const testUrl = '/api/websites/ansa/ferrari';
            const response = await request(app)
                .get(testUrl)
                .expect('Content-Type', /json/)
                .expect(200);
        });
        it('Should fail with 404 when provided siteName is not in the db', async () => {
            const testUrl = '/api/websites/anselmo/italia';
            const response = await request(app).get(testUrl).expect(404);
        });
        it('Should fail with 404 when no keyword is provided', async () => {
            const testUrl = '/api/websites/ansa/';
            const response = await request(app).get(testUrl).expect(404);
        });
    });
});

describe('Article Parser Tests', () => {
    it('Should return with expectedOutput array', () => {
        const html = require('./testHelper').mockHTML;
        const expectedOutput = require('./testHelper').expectedArticles;
        const result = extractArticlesFromHtml(html, 'bollettino');
        expect(result).toEqual(expectedOutput);
    });
    it('Should return an empty array when no articles are found', () => {
        const html = require('./testHelper').mockHTML;
        const result = extractArticlesFromHtml(html, 'gelato');
        expect(result).toEqual([]);
    });
});
