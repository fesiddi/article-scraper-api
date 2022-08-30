const app = require('../app');
const request = require('supertest');
const Website = require('../model/Website');
const User = require('../model/User');
const { connectDB, disconnectDB } = require('../utils/dbConnection');

let accessToken = '';

beforeAll(async () => {
    await connectDB();
    await Website.deleteMany({});
    await User.deleteMany({});
});

afterAll(async () => {
    await Website.deleteMany({});
    await User.deleteMany({});
    await disconnectDB();
});

describe('Auth Endpoints Tests', () => {
    const api = request(app);
    describe('/register route tests', () => {
        it('Should register a new user saving it in the db', async () => {
            const response = await api
                .post('/register')
                .send({ username: 'testuser', password: 'test123' })
                .expect(201);
            expect(response.body).toEqual(
                expect.objectContaining({
                    Success: 'New username testuser created!',
                })
            );
        });
        it('Should not register a user if already present in db', async () => {
            const response = await api
                .post('/register')
                .send({ username: 'testuser', password: 'test123' })
                .expect(409);
        });
        it('Should not register a user if a required field is missing in the req.body', async () => {
            const response = await api
                .post('/register')
                .send({ username: '', password: 'test123' })
                .expect(400);
        });
    });
    describe('/auth route tests', () => {
        it('Should authenticate the user if found in db', async () => {
            const response = await api
                .post('/auth')
                .send({ username: 'testuser', password: 'test123' })
                .expect(200);
            accessToken = response.body.accessToken;
            expect(response.body).toEqual(
                expect.objectContaining({
                    accessToken: accessToken,
                })
            );
        });
        it('Should respond with 401 if user not found in db', async () => {
            const response = await api
                .post('/auth')
                .send({ username: 'testuser33', password: 'test123' })
                .expect(401);
        });
        it('Should respond with 400 if username or password is not provided in req.body', async () => {
            const response = await api
                .post('/auth')
                .send({ username: 'testuser', password: '' })
                .expect(400);
        });
    });
});

describe('API Endopoints Tests', () => {
    const api = request(app);

    describe('POST /api/websites', () => {
        it('Should post a new website url with valid data', async () => {
            await connectDB();
            const response = await api
                .post('/api/websites')
                .set('Authorization', `Bearer ${accessToken}`)
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
                .set('Authorization', `Bearer ${accessToken}`)
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
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    url: 'http://www.ansa.it',
                })
                .expect(409);
        });
        it('fails with status code 400 when data is not valid or missing', async () => {
            const response = await api
                .post('/api/websites')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ url: '' })
                .expect(400);
        });
        it('fails with status code 404 when provided url is not existing', async () => {
            const response = await api
                .post('/api/websites')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ url: 'http://www.fdsafsadfdafdafsdf.com' })
                .expect(404);
        });
    });

    describe('GET /api/websites', () => {
        it('Should return a list of websites that are stored in the database', async () => {
            const response = await api
                .get('/api/websites')
                .set('Authorization', `Bearer ${accessToken}`)
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
                .set('Authorization', `Bearer ${accessToken}`)
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
                .set('Authorization', `Bearer ${accessToken}`)
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
                .set('Authorization', `Bearer ${accessToken}`)
                .expect('Content-Type', /json/)
                .expect(200);
        });

        it('Should fail with 404 when provided siteName is not in the db', async () => {
            const testUrl = '/api/articles/?siteName=anselmo&keyword=italia';
            const response = await api
                .get(testUrl)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(404);
        });
        it('Should fail with 400 when no keyword is provided', async () => {
            const testUrl = '/api/articles/?siteName=ansa&keyword=';
            const response = await api
                .get(testUrl)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(400);
        });
    });

    describe('GET /api/articles/?siteName=all&keyword=', () => {
        it("Should return with 200 if 'all' and a keyword is provided", async () => {
            const testUrl = '/api/articles/?siteName=all&keyword=ferrari';
            const response = await api
                .get(testUrl)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });
});
