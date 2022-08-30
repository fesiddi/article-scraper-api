const app = require('../app');
const request = require('supertest');
const Website = require('../model/Website');
const { connectDB, disconnectDB } = require('../utils/dbConnection');
const {
    extractArticlesFromHtml,
} = require('../controllers/articles/getArticles');

beforeAll(async () => {
    await connectDB();
    await Website.deleteMany({});
});

afterAll(async () => {
    await Website.deleteMany({});
    await disconnectDB();
});

describe('API Endopoints Tests', () => {
    const api = request(app);

    describe('POST /api/websites', () => {
        it('Should post a new website url with valid data', async () => {
            await connectDB();
            const response = await api
                .post('/api/websites')
                .send({
                    url: 'http://www.ansa.it/',
                })
                .expect(201);

            expect(response.body).toEqual(
                expect.objectContaining({
                    url: 'http://www.ansa.it/',
                    siteName: 'ansa',
                    id: expect.any(String),
                })
            );
        });
        it('Should post repubblica website if provided with this url http://www.repubblica.it/', async () => {
            await connectDB();
            const response = await api
                .post('/api/websites')
                .send({
                    url: 'http://www.repubblica.it/',
                })
                .expect(201);

            expect(response.body).toEqual(
                expect.objectContaining({
                    url: 'http://www.repubblica.it/',
                    siteName: 'repubblica',
                    id: expect.any(String),
                })
            );
        });
        it('Should fail with status code 409 when data is already present in db', async () => {
            const response = await api
                .post('/api/websites')
                .send({
                    url: 'http://www.ansa.it',
                })
                .expect(409);
        });
        it('fails with status code 400 when data is not valid or missing', async () => {
            const response = await api
                .post('/api/websites')
                .send({ url: '' })
                .expect(400);
        });
        it('fails with status code 404 when provided url is not existing', async () => {
            const response = await api
                .post('/api/websites')
                .send({ url: 'http://www.fdsafsadfdafdafsdf.com' })
                .expect(404);
        });
    });

    describe('GET /api/websites', () => {
        it('Should return a list of websites that are stored in the database', async () => {
            const response = await api
                .get('/api/websites')
                .expect('Content-Type', /application\/json/)
                .expect(200);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        url: 'http://www.ansa.it/',
                        siteName: 'ansa',
                        id: expect.any(String),
                    }),
                ])
            );
        });
    });
    describe('DELETE /api/websites/:siteName', () => {
        it('Should delete the repubblica website stored in the database', async () => {
            const response = await api
                .delete('/api/websites/repubblica')
                .expect('Content-Type', /application\/json/)
                .expect(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    Success: 'Website repubblica successfully deleted!',
                })
            );
        });
    });
    describe('DELETE /api/websites/:siteName', () => {
        it('Should return 404 if website to delete is not found in the database', async () => {
            const response = await api
                .delete('/api/websites/repubblica')
                .expect('Content-Type', /application\/json/)
                .expect(404);
            expect(response.body).toEqual(
                expect.objectContaining({
                    Error: "Can't delete repubblica. Website not found in database.",
                })
            );
        });
    });

    describe('GET /api/articles/?siteName=&keyword=', () => {
        it('Should return with 200 if siteName is in db and a keyword is provided', async () => {
            const testUrl = '/api/articles/?siteName=ansa&keyword=ferrari';
            const response = await api
                .get(testUrl)
                .expect('Content-Type', /json/)
                .expect(200);
        });

        it('Should fail with 404 when provided siteName is not in the db', async () => {
            const testUrl = '/api/articles/?siteName=anselmo&keyword=italia';
            const response = await api.get(testUrl).expect(404);
        });
        it('Should fail with 400 when no keyword is provided', async () => {
            const testUrl = '/api/articles/?siteName=ansa&keyword=';
            const response = await api.get(testUrl).expect(400);
        });
    });

    describe('GET /api/articles/?siteName=all&keyword=', () => {
        it("Should return with 200 if 'all' and a keyword is provided", async () => {
            const testUrl = '/api/articles/?siteName=all&keyword=ferrari';
            const response = await api
                .get(testUrl)
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });
});
