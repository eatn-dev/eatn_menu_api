const router = require("express").Router()
const db = require("../sequelizeConnection")
const { createTagValidator, getTagByIdValidator, updateTagValidator, deleteTagValidator } = require("./validators")

router.post("/", createTagValidator, async (req, res) => {
    const { name, bgColor, fgColor, icon } = req.body

    let tag
    try {
        tag = await db.Tag.create({
            name: name,
            bgColor: bgColor,
            fgColor: fgColor,
            icon: icon
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
                message: "Tag successfully created.",
                returning: {
                    tagId: tag.id
                }
            }
        }
    )
})

router.get("/", async (req, res) => {
    try{
        const tags = await db.Tag.findAll({
            include: [
                {
                    model: db.MenuItem,
                    as: "menu_items"
                }
            ]
        })

        return res.json({ data: tags})
    } catch(err) {
        console.log(err)
        return res.sendStatus(400)
    }
})

router.get("/:id", getTagByIdValidator, async (req, res) => {
    const id = req.params.id

    let tag
    try { 
        tag = await db.Tag.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: db.MenuItem,
                    as: "menu_items"
                }
            ]
        })
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

    if (!tag)
        return res.sendStatus(404)

    return res.json({ data: tag })
})

router.put("/:id", updateTagValidator, async (req, res) => {
    const id = req.params.id
    const { name, bgColor, fgColor, icon } = req.body

    let returning
    try {
        returning = await db.Tag.update(
            {
                name: name,
                bgColor: bgColor,
                fgColor: fgColor,
                icon: icon
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
                message: "Tag successfully updated."
            }
        }
    )
})

router.delete("/:id", deleteTagValidator, async (req, res) => {
    const id = req.params.id

    let returning
    try {
        returning = await db.Tag.destroy({
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
                message: "Tag successfully deleted." 
            }
        }
    )
})

module.exports = router
