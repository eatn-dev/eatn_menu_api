const router = require("express").Router()
const db = require("../sequelizeConnection")
const { createItemValidator, getItemByIdValidator, updateItemValidator, deleteItemValidator, assignTagToItemValidator } = require("./validators")


// create new menu item
router.post("/", createItemValidator, async (req, res) => {
    const { name, price, quantity, description, subcategoryId } = req.body

    // TODO: ask leon if i should have 1 try-catch per query or 1 try-catch per route

    let subcategory
    try{
        if (subcategoryId){
            subcategory = await db.Subcategory.findOne({
                where: {
                    id: subcategoryId
                }
            })
    
            if (!subcategory)
                return res.sendStatus(404)
        }
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

    let item
    try {
        item = await db.MenuItem.create({
            name: name,
            price: price,
            quantity: quantity,
            description: description,
            subcategoryId: subcategoryId
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
                message: "Menu item successfully created.",
                returning: {
                    menuItemId: item.id
                }
            }
        }
    )

})

// get all menu items
router.get("/", async (req, res) => {   
 
    try{
        const items = await db.MenuItem.findAll({
            attributes: {
                exclude: ["subcategoryId"]
            },
            include: [
                {
                    model: db.Tag,
                    as: "tags"
                },
                {
                    model: db.Subcategory,
                    as: "subcategory",
                    attributes: {
                        exclude: ["categoryId"]
                    },
                    include : [
                        {
                            model: db.Category,
                            as: "category"
                        }
                    ]
                }
            ]
        })

        return res.json({ data: items })
    } catch(err){
        console.log(err)
        return res.sendStatus(400)
    }
})

// get menu item by id
router.get("/:id", getItemByIdValidator, async (req, res) => {
    const id = req.params.id

    let item
    try {
        item = await db.MenuItem.findOne({
            where: {
                id: id
            },
            attributes: {
                exclude: ["subcategoryId"]
            },
            include: [
                {
                    model: db.Tag,
                    as: "tags",
                },
                {
                    model: db.Subcategory,
                    as: "subcategory",
                    attributes: {
                        exclude: ["categoryId"]
                    },
                    include : [
                        {
                            model: db.Category,
                            as: "category"
                        }
                    ]
                }
            ]
        })
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

    if (!item)
        return res.sendStatus(404)

    return res.json({ data: item })
})

// update menu item
router.put("/:id", updateItemValidator, async (req, res) => {
    const id = req.params.id
    const { name, price, quantity, description, subcategoryId } = req.body
    
    let subcategory
    try{
        if (subcategoryId){
            subcategory = await db.Subcategory.findOne({
                where: {
                    id: subcategoryId
                }
            })
    
            if (!subcategory)
                return res.sendStatus(404)
        }
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

    let returning
    try {
        returning = await db.MenuItem.update(
            {
                name: name,
                price: price,
                quantity: quantity,
                description: description,
                subcategoryId: subcategoryId
            },
            {
                where: {
                    id: id
                }
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

    if (returning[0] !== 1)
        return res.sendStatus(404)

    return res.json(
        {
            data: { 
                message: "Menu item successfully updated."
            }
        }
    )
})

// delete menu item
router.delete("/:id", deleteItemValidator, async (req, res) => {
    const id = req.params.id

    let returning
    try {
        returning = await db.MenuItem.destroy({
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
                message: "Menu item successfully deleted." 
            }
        }
    )
})

// assign tag to menu item
router.post("/:menuItemId/tags", assignTagToItemValidator, async (req, res) => {
    const tagId = req.body.tagId
    const menuItemId = req.params.menuItemId

    // TODO: ask leon if this try-catch coverage is okay
    try {
        const tag = await db.Tag.findOne({
            where: {
                id: tagId
            }
        })
    
        if (!tag)
            return res.sendStatus(404)
    
        const menuItem = await db.MenuItem.findOne({
            where: {
                id: menuItemId
            }
        })
    
        if (!menuItem)
            return res.sendStatus(404)
    
        // check if tag is already assigned
        const tagAlreadyAssigned = await menuItem.hasTag(tag)
    
        if (tagAlreadyAssigned){
            return res.status(409).json(
                {
                    data: {
                        message: `\`${tag.name}\` tag is already assigned to \`${menuItem.name}\`.`
                    }
                }
            )
        }
        
        await menuItem.addTag(tag)
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

    return res.json(
        { 
            data: {
                message: "Tag assigned successfully." 
            }
        }
    )
})

router.delete("/:menuItemId/tags/:tagId", assignTagToItemValidator, async (req, res) => {
    const tagId = req.params.tagId
    const menuItemId = req.params.menuItemId

    try {
        const tag = await db.Tag.findOne({
            where: {
                id: tagId
            }
        })
    
        if (!tag)
            return res.sendStatus(404)
    
        const menuItem = await db.MenuItem.findOne({
            where: {
                id: menuItemId
            }
        })
    
        if (!menuItem)
            return res.sendStatus(404)
    
        // check if tag is already assigned
        const tagAlreadyAssigned = await menuItem.hasTag(tag)
    
        if (!tagAlreadyAssigned){
            return res.sendStatus(404)
        }
        
        await menuItem.removeTag(tag)
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

    return res.json(
        { 
            data: {
                message: "Tag removed successfully." 
            }
        }
    )
})

module.exports = router
