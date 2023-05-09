const router = require("express").Router()
const db = require("../sequelizeConnection")
const { createSubcategoryValidator, getSubcategoryByIdValidator, updateSubcategoryValidator, deleteSubcategoryValidator } = require("./validators")

router.post("/", createSubcategoryValidator, async (req, res) => {
    const { name, categoryId } = req.body
        
    // check if parent category exists
    let category
    try  {
        category = await db.Category.findOne({
            where: {
                id: categoryId
            }
        })

        if (!category)
            return res.sendStatus(404)
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
        
    let subcategory
    try {
        subcategory = await db.Subcategory.create({
            name: name,
            categoryId: category.id
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
                message: "Subcategory successfully created.",
                returning: {
                    subcategoryId: subcategory.id
                }
            }
        }
    )
})

router.get("/", async (req, res) => {
    let subcategories
    try {
        subcategories = await db.Subcategory.findAll({
            attributes: {
                exclude: ["categoryId"]
            },
            include: [
                {
                    model: db.MenuItem,
                    as: "menu_items",
                    attributes: {
                        exclude: ["subcategoryId"]
                    }
                },
                {
                    model: db.Category,
                    as: "category"
                }
            ]
        })
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

    return res.json({ data: subcategories})
})

router.get("/:id", getSubcategoryByIdValidator, async (req, res) => {
    const id = req.params.id

    let subcategory
    try{
        subcategory = await db.Subcategory.findOne({
            attributes: {
                exclude: ["categoryId"]
            },
            where: {
                id: id
            },
            include: [
                {
                    model: db.MenuItem,
                    as: "menu_items",
                    attributes: {
                        exclude: ["subcategoryId"]
                    }
                }
            ]
        })
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

    if (!subcategory)
        return res.sendStatus(404)

    return res.json({ data: subcategory })
})

router.put("/:id", updateSubcategoryValidator, async (req, res) => {
    const id = req.params.id
    const { name, categoryId } = req.body

    // check if parent category exists
    let category
    try {
        category = await db.Category.findOne({
            where: {
                id: categoryId
            }
        })
    
        if (!category)
            return res.sendStatus(404)
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

    let returning
    try {
        returning = await db.Subcategory.update(
            {
                id: id,
                name: name,
                categoryId: categoryId
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
                message: "Subcategory successfully updated."
            }
        }
    )
})

router.delete("/:id", deleteSubcategoryValidator, async (req, res) => {
    const id = req.params.id

    let returning
    try {
        returning = await db.Subcategory.destroy({
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
