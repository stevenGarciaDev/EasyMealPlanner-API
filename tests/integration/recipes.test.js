const request = require('supertest');

let server;
describe('/api/recipes', () => {
    beforeEach(() => { server = require('../../index'); })
    afterEach(() => { server.close() });

    describe('GET /', () => { 
        it('should return all recipes from database', async () => {
            const res = await request(server).get('/api/recipes');
            expect(res.status).toBe(200);
        });
    });

    describe('GET /:category', () => {

    });

    describe('GET /savedRecipes', () => {

    });

    describe('GET /:recipeId', () => {

    });

    describe('POST /', () => {

    });

    describe('PUT /toggleSave/:recipeId', () => {

    });

    describe('DELETE /:recipeId', () => {

    });
});