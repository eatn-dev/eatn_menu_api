const router = require("express").Router()
const db = require("../sequelizeConnection")
const { createCategoryValidator, getCategoryByIdValidator, updateCategoryValidator, deleteCategoryValidator } = require("./validators")

router.post("/", createCategoryValidator, async (req, res) => {
    const { name } = req.body
    
    let category
    try {
        category = await db.Category.create({
            name: name
        })
    } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError")
            return res.status(409).json(
                {
                    data: {
                        message: "That name is already taken."
                    }
                }
            )

        console.log(err)
        return res.sendStatus(500)
    }

    return res.json(
        {
            data: {
                message: "Category successfully created.",
                returning: {
                    categoryId: category.id
                }
            }
        }
    )
})

router.get("/", async (req, res) => {
    let categories
    try {
        categories = await db.Category.findAll({
            include: [
                {
                    model: db.Subcategory,
                    as: "subcategories",
                    attributes: {
                        exclude: ["categoryId"]
                    }
                }
            ]
        })
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

    return res.json({ data: categories})
})

router.get("/:id", getCategoryByIdValidator, async (req, res) => {
    const id = req.params.id

    let category
    try{
        category = await db.Category.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: db.Subcategory,
                    as: "subcategories",
                    attributes: {
                        exclude: ["categoryId"]
                    }
                }
            ]
        })
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

    if (!category)
        return res.sendStatus(404)

    return res.json({ data: category })
})

router.put("/:id", updateCategoryValidator, async (req, res) => {
    const id = req.params.id
    const { name } = req.body

    let returning
    try {
        returning = await db.Category.update(
            {
                id: id,
                name: name
            },
            {
                where: {
                    id: id
                }
            }
        )
    } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError")
            return res.status(409).json(
                {
                    data: {
                        message: "That name is already taken."
                    }
                }
            )
            
        console.log(err)
        return res.sendStatus(500)
    }

    if (returning[0] !== 1)
        return res.sendStatus(404)

    return res.json(
        {
            data: { 
                message: "Category successfully updated."
            }
        }
    )
})

router.delete("/:id", deleteCategoryValidator, async (req, res) => {
    const id = req.params.id

    let returning
    try {
        returning = await db.Category.destroy({
            where: {
                id: id
            }
        })
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

    if (returning !== 1)
        return res.sendStatus(404)

    return res.json(
        { 
            data: {
                message: "Category successfully deleted." 
            }
        }
    )
})

module.exports = router
