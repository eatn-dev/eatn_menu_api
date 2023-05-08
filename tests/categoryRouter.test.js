const app = require("../app")
const db = require("../sequelizeConnection")
const supertest = require("supertest")
const request = supertest(app)

beforeAll(async () => {
    await db.sequelize.authenticate()
    await db.sequelize.sync()
})

beforeEach(async () => {
    await db.sequelize.truncate()
})

describe("Category router", () => {
    describe("Create new category", () => {
        test("Successful scenario", async () => {
            // arrange
            const category = {
                name: "Food"
            }
    
            // act
            const response = await request
                .post("/categories")
                .send(category)
    
            // assert
            expect(response.statusCode).toBe(200)
        })
      
        test("Invalid request body format scenario", async () => {
            // arrange
            const category = {
                name: 1234
            }

            await request
                .post("/categories")
                .send(category)
    
            // act
            const response = await request
                .post("/categories")
                .send(category)
    
            // assert
            expect(response.statusCode).toBe(400)
        })

        test("Duplicate name scenario", async () => {
            // arrange
            const category = {
                name: "Food"
            }

            await request
                .post("/categories")
                .send(category)
    
            // act
            const response = await request
                .post("/categories")
                .send(category)
    
            // assert
            expect(response.statusCode).toBe(409)
        })
    })

    describe("Get all categories", () => {
        test("No categories present scenario", async () => {
            // act
            const response = await request
                .get("/categories")
    
            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body).toMatchObject({ data: [] })
        })

        test("One category present scenario", async () => {
            // arrange
            const category = {
                name: "Food"
            }

            await request
                .post("/categories")
                .send(category)

            // act
            const response = await request
                .get("/categories")

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body).toMatchObject({ data: [ category ] })
        })

        test("Multiple categories present scenario", async () => {
            // arrange
            const category1 = {
                name: "Food"
            }
            const category2 = {
                name: "Drinks"
            }

            await request
                .post("/categories")
                .send(category1)
            await request
                .post("/categories")
                .send(category2)

            // act
            const response = await request
                .get("/categories")

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body).toMatchObject({ data: [ category1, category2 ] })
        })
    })

    describe("Get category by id", () => {
        test("Successful scenario", async () => {
            // arrange
            
            // the reason for inserting directly in the database is
            // getting the id in a sane manner without contacting the api
            // to many times and to not make any more points of failure
            // in the tests themselves, also it makes that much more cleaner
            // and faster tests
            const category = await db.Category.create({
                name: "Food"
            })

            // act
            const response = await request
                .get(`/categories/${category.id}`)

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body).toMatchObject(
                {
                    data: {
                        id: category.id,
                        name: category.name,
                        createdAt: category.createdAt.toISOString(),
                        updatedAt: category.updatedAt.toISOString(),
                        subcategories: []
                    }
                }
            )
        })

        test("Invalid id format scenario", async () => {
            // arrange
            const id = "asdf"

            // act
            const response = await request
                .get(`/categories/${id}`)
            
            // assert
            expect(response.statusCode).toBe(400)
        })

        test("Nonexistent id scenario", async () => {
            // arrange
            const id = 0

            // act
            const response = await request
                .get(`/categories/${id}`)
            
            // assert
            expect(response.statusCode).toBe(404)
        })
    })

    describe("Update category by id", () => {
        test("Successful scenario", async () => {
            // arrange
            const category = await db.Category.create({
                name: "Food"
            })

            const newCategoryData = {
                name: "Drinks"
            }
    
            // act
            const response = await request
                .put(`/categories/${category.id}`)
                .send(newCategoryData)
    
            // assert
            expect(response.statusCode).toBe(200)
        })

        test("Invalid id format scenario", async () => {
            // arrange
            const id = "asdf"
            const newCategoryData = {
                name: "Drinks"
            }
    
            // act
            const response = await request
                .put(`/categories/${id}`)
                .send(newCategoryData)
    
            // assert
            expect(response.statusCode).toBe(400)
            expect(response.body.data.errors.id).toBeTruthy()
        })

        test("Invalid request body format scenario", async () => {
            // arrange
            const category = await db.Category.create({
                name: "Food"
            })

            const newCategoryData = {
                name: 1234
            }
    
            // act
            const response = await request
                .put(`/categories/${category.id}`)
                .send(newCategoryData)
    
            // assert
            expect(response.statusCode).toBe(400)
            expect(response.body.data.errors.name).toBeTruthy()
        })

        test("Nonexistent id scenario", async () => {
            // arrange
            const id = 0
            const newCategoryData = {
                name: "Drinks"
            }
    
            // act
            const response = await request
                .put(`/categories/${id}`)
                .send(newCategoryData)
    
            // assert
            expect(response.statusCode).toBe(404)
        })

        test("Duplicate name scenario", async () => {
            // arrange
            await db.Category.create({
                name: "Food"
            })
            const category2 = await db.Category.create({
                name: "Drinks"
            })
            const newCategory2Data = {
                name: "Food"
            }
    
            // act
            const response = await request
                .put(`/categories/${category2.id}`)
                .send(newCategory2Data)
    
            // assert
            expect(response.statusCode).toBe(409)
        })
    })

    describe("Delete category by id", () => {
        test("Successful scenario", async () => {
            // arrange
            const category = await db.Category.create({
                name: "Food"
            })

            // act
            const response = await request
                .delete(`/categories/${category.id}`)

            // assert
            expect(response.statusCode).toBe(200)
        })

        test("Invalid id format scenario", async () => {
            // arrange
            const id = "asdf"

            // act
            const response = await request
                .delete(`/categories/${id}`)
            
            // assert
            expect(response.statusCode).toBe(400)
        })

        test("Nonexistent id scenario", async () => {
            // arrange
            const id = 0

            // act
            const response = await request
                .delete(`/categories/${id}`)
            
            // assert
            expect(response.statusCode).toBe(404)
        })
    })
})

afterAll(async () => {
    await db.sequelize.truncate()
})
