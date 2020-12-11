const request = require('supertest');
const mongoose = require('mongoose');
const { Recipe } = require('../../models/recipe');
const { User } = require('../../models/user');
const { UserSavedRecipe } = require('../../models/userSavedRecipe');
const { MealType } = require('../../models/mealType');
const { RecipeMealType } = require('../../models/recipeMealType');

let server;
let user;
let token;
let recipe;
describe('/api/recipes', () => {
    beforeEach(async () => { 
        server = require('../../index');
        user = {
            _id: mongoose.Types.ObjectId(),
            firstName: 'John Snow',
            email: 'test@gmail.com',
            password: 'password',
            unitForMass: "Pounds (lbs)",
            currentWeight: 190,
            goalWeight: 180,
            goalBodyType: 'Muscular and Strong',
            activityLevel: 'Love to exercise (5-7x a week)',
            gender: 'Male',
            age: 21,
            heightInFeet: 6,
            heightInRemainingInches: 0,
            dietRestrictions: ['milk'],
            confirmAccount: true,
            completedOnboarding: true,
            isAdmin: true
        };
        recipe = {
            name: 'unique recipe',
            servings: 5,
            minutesToCook: 45,
            calories: 500,
            protein: 30,
            carbohydrates: 200,
            fats: 15,
            image: "test",
            description: "test",
            ingredients: []
        };
        token = new User(user).generateAuthToken();
        await User.collection.insertOne(user);
    });

    afterEach(async () => {
        server.close();
        user = null;
        token = null;
        await Recipe.deleteMany({});
        await User.deleteMany({});
        await UserSavedRecipe.deleteMany({});
        await MealType.deleteMany({});
        await RecipeMealType.deleteMany({});
    });

    describe('GET /', () => { 
        it("filters recipes that contain a user's diet restriction", async () => {
            const ingredient1 = { name: 'milk', amount: 1, unitForMeasurement: 'cup', aisle: 'Dairy'};
            const ingredient2 = {...ingredient1, name: 'cocoa'};
            const ingredient3 = {...ingredient1, name: 'eggs'};
            await Recipe.collection.insertMany([
                {...recipe, name: 'recipe 1', ingredients: [ingredient1]},
                {...recipe, name: 'recipe 2', ingredients: [ingredient2]},
                {...recipe, name: 'recipe 3', ingredients: [ingredient3]},
            ]);

            const response = await request(server)
                .get('/api/recipes/')
                .set('x-auth-token', token);

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(2);
        });
    });

    describe('GET /recipeCategory/:categoryId', () => {
        it('returns all recipes in an associated category', async () => {
            await Recipe.collection.insertOne(recipe);
            const mealType = await MealType.collection.insertOne({ mealType: 'Breakfast' });
            const categoryId = mealType.ops[0]._id;
            await RecipeMealType.collection.insertOne({ 
                recipeID: recipe._id,
                mealTypeID: categoryId
            });

            const recipesInCategory = await request(server)
                .get(`/api/recipes/recipeCategory/${categoryId}`)
                .set('x-auth-token', token);

            expect(recipesInCategory.statusCode).toBe(200);
            expect(recipesInCategory.body.length).toBe(1);
        });
    });

    describe('GET /savedRecipes', () => {
        it('returns all recipes saved by the current user', async () => {
            const recipeResult = await request(server)
                .post('/api/recipes/')
                .set('x-auth-token', token)
                .send(recipe);

            await request(server)
                .post(`/api/recipes/saveRecipe/${recipeResult.body._id}`)
                .set('x-auth-token', token);

            const response = await request(server)
                .get('/api/recipes/savedRecipes')
                .set('x-auth-token', token);

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1);
        });
    });

    describe('GET /:recipeId', () => {
        it('returns a recipe with the unique id', async () => {
            await Recipe.collection.insertOne(recipe);

            const result = await request(server)
                .get(`/api/recipes/${recipe._id}`)
                .set('x-auth-token', token);

            expect(result.statusCode).toBe(200);
        });
    });

    describe('POST /', () => {
        it('creates a new recipe successfully', async () => {
            const response = await request(server)
                .post('/api/recipes/')
                .set('x-auth-token', token)
                .send(recipe);

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject(recipe);
        });

        it('returns a 409 status code when a recipe with the same name already exists', async () => {
            await request(server)
                .post('/api/recipes/')
                .set('x-auth-token', token)
                .send(recipe);

            const duplicateAttempt = await request(server)
                .post('/api/recipes/')
                .set('x-auth-token', token)
                .send(recipe);

            expect(duplicateAttempt.statusCode).toBe(409);
        });
    });

    describe('POST /saveRecipe/:recipeId', () => {
        it('returns the successfully saved recipe corresponding with the user', async () => {
            await Recipe.collection.insertOne(recipe);

            const savedRecipeResponse = await request(server)
                .post(`/api/recipes/saveRecipe/${recipe._id}`)
                .set('x-auth-token', token);

            expect(savedRecipeResponse.statusCode).toBe(200);
            expect(savedRecipeResponse.body.userID).toBe(user._id.toHexString());
            expect(savedRecipeResponse.body.recipeID).toBeDefined();
        });

        it('returns 404 if recipe does not exist', async () => {
            const randomId = mongoose.Types.ObjectId().toHexString()
            const savedRecipeResponse = await request(server)
                .post(`/api/recipes/saveRecipe/${randomId}`)
                .set('x-auth-token', token);

            expect(savedRecipeResponse.statusCode).toBe(404);
        });

        it('returns 409 if the user has already saved the recipe', async () => {
            const recipeResult = await request(server)
                .post('/api/recipes/')
                .set('x-auth-token', token)
                .send(recipe);

            await request(server)
                .post(`/api/recipes/saveRecipe/${recipeResult.body._id}`)
                .set('x-auth-token', token);

            const duplicateSavedRecipe = await request(server)
                .post(`/api/recipes/saveRecipe/${recipeResult.body._id}`)
                .set('x-auth-token', token);

            expect(duplicateSavedRecipe.statusCode).toBe(409);
        });
    });

    describe('POST /createCategory', () => {
        it('successfully creates a new recipe category', async () => {
            const category = 'Breakfast';

            const response = await request(server)
                .post(`/api/recipes/createCategory`)
                .set('x-auth-token', token)
                .send({ mealType: category });

            expect(response.statusCode).toBe(200);
            expect(response.body.mealType).toBe(category);
        });
    });

    describe('POST /addToCategory/:categoryId/:recipeId', () => {
        it('successfully adds a recipe to a category', async () => {
            await Recipe.collection.insertOne(recipe);
            const category = 'Breakfast';
            const categoryResponse = await request(server)
                .post(`/api/recipes/createCategory`)
                .set('x-auth-token', token)
                .send({ mealType: category });
            const categoryId = categoryResponse.body._id;

            const response = await request(server)
                .post(`/api/recipes/addToCategory/${categoryId}/${recipe._id}`)
                .set('x-auth-token', token);

            expect(response.statusCode).toBe(200);
            expect(response.body.mealTypeID).toBe(categoryId);
            expect(response.body.recipeID).toBe(recipe._id.toHexString());
        });
        
        it('returns 404 status code if the recipe does not exists', async () => {
            const randomObjectId = mongoose.Types.ObjectId();
            const category = 'Breakfast';
            const categoryResponse = await request(server)
                .post(`/api/recipes/createCategory`)
                .set('x-auth-token', token)
                .send({ mealType: category });
            const categoryId = categoryResponse.body._id;

            const response = await request(server)
                .post(`/api/recipes/addToCategory/${categoryId}/${randomObjectId}`)
                .set('x-auth-token', token);

            expect(response.statusCode).toBe(404);
        });
    });

    describe('DELETE /removeSavedRecipe/:recipeId', () => {
        it('should delete a user saved recipe', async () => {
            await Recipe.collection.insertOne(recipe);
            await request(server)
                .post(`/api/recipes/saveRecipe/${recipe._id}`)
                .set('x-auth-token', token);

            const response = await request(server)
                .delete(`/api/recipes/removeSavedRecipe/${recipe._id}`)
                .set('x-auth-token', token);

            expect(response.statusCode).toBe(200);
        });
    });

    describe('DELETE /:recipeId', () => {
        it('should delete a recipe based on its unique id', async () => {
            await Recipe.collection.insertOne(recipe);

            const response = await request(server)
                .delete(`/api/recipes/${recipe._id}`)
                .set('x-auth-token', token);

            expect(response.statusCode).toBe(200);
        });
    });
});