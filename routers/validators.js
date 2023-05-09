const Validator = require("validatorjs")

const createItemValidator = (req, res, next) => {
    const createItemFormat = {
        name: "required|string|between:1,255",
        price: "required|numeric|min:0.01",
        quantity: "required|string|between:1,255",
        description: "required|string",
        subcategoryId: "integer"
    }

    const { name, price, quantity, description, subcategoryId } = req.body

    const validation = new Validator(
        { name, price, quantity, description, subcategoryId },
        createItemFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })

    return next()
}

const getItemByIdValidator = (req, res, next) => {
    const getItemByIdFormat = {
        id: "required|integer"
    }

    const id = req.params.id

    const validation = new Validator(
        { id },
        getItemByIdFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })

    return next()
}

const updateItemValidator = (req, res, next) => {
    const updateItemFormat = {
        id: "required|integer",
        name: "required|string|between:1,255",
        price: "required|numeric|min:0.01",
        quantity: "required|string|between:1,255",
        description: "required|string",
        subcategoryId: "integer"
    }

    const id = req.params.id
    const { name, price, quantity, description, subcategoryId } = req.body

    const validation = new Validator(
        { id, name, price, quantity, description, subcategoryId },
        updateItemFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })

    return next()
}

const deleteItemValidator = (req, res, next) => {
    const deleteItemFormat = {
        id: "required|integer"
    }

    const id = req.params.id

    const validation = new Validator(
        { id },
        deleteItemFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })

    return next()
}
    
const assignTagToItemValidator = (req, res, next) => {
    const assignTagToItemFormat = {
        tagId: "required|integer",
        menuItemId: "required|integer"
    }

    const tagId = req.body.tagId || req.params.tagId
    const menuItemId = req.params.menuItemId

    const validation = new Validator(
        {
            tagId,
            menuItemId
        },
        assignTagToItemFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })

    return next()
}

const createTagValidator = (req, res, next) => {
    const createTagFormat = {
        name: "required|string|between:1,255",
        bgColor: ["required", "string", "regex:^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"],
        fgColor: ["required", "string", "regex:^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"],
        icon: "required|string"
    }

    const { name, bgColor, fgColor, icon } = req.body

    const validation = new Validator(
        { name, bgColor, fgColor, icon },
        createTagFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })

    return next()
}

const getTagByIdValidator = (req, res, next) => {
    const getTagByIdFormat = {
        id: "required|integer"
    }

    const id = req.params.id

    const validation = new Validator(
        { id },
        getTagByIdFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })
    
    return next()
}

const updateTagValidator = (req, res, next) => {
    const updateTagFormat = {
        id: "required|integer",
        name: "required|string|between:1,255",
        bgColor: ["required", "string", "regex:^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"],
        fgColor: ["required", "string", "regex:^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"],
        icon: "required|string"
    }

    const id = req.params.id
    const { name, bgColor, fgColor, icon } = req.body

    const validation = new Validator(
        { id, name, bgColor, fgColor, icon },
        updateTagFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })

    return next()
}

const deleteTagValidator = (req, res, next) => {
    const deleteTagFormat = {
        id: "required|integer"
    }

    const id = req.params.id

    const validation = new Validator(
        { id },
        deleteTagFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })

    return next()
}

const createCategoryValidator = (req, res, next) => {
    const createCategoryFormat = {
        name: "required|string"
    }

    const { name } = req.body

    const validation = new Validator(
        { name },
        createCategoryFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })
    
    return next()
}

const getCategoryByIdValidator = (req, res, next) => {
    const getCategoryByIdFormat = {
        id: "required|integer"
    }

    const id = req.params.id

    const validation = new Validator(
        { id },
        getCategoryByIdFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })
    
    return next()
}

const updateCategoryValidator = (req, res, next) => {
    const updateCategoryFormat = {
        name: "required|string|between:1,255",
        id: "required|integer"
    }
    
    const id = req.params.id
    const { name } = req.body

    const validation = new Validator(
        { id, name },
        updateCategoryFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })
    
    return next()
}

const deleteCategoryValidator = (req, res, next) => {
    const deleteCategoryFormat = {
        id: "required|integer"
    }

    const id = req.params.id

    const validation = new Validator(
        { id },
        deleteCategoryFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })
    
    return next()
}

const createSubcategoryValidator = (req, res, next) => {
    const createSubcategoryFormat = {
        name: "required|string",
        categoryId: "required|integer"
    }

    const { name, categoryId } = req.body

    const validation = new Validator(
        { name, categoryId },
        createSubcategoryFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })

    return next()
}

const getSubcategoryByIdValidator = (req, res, next) => {
    const getSubcategoryByIdFormat = {
        id: "required|integer"
    }

    const id = req.params.id

    const validation = new Validator(
        { id },
        getSubcategoryByIdFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })

    return next()
}

const updateSubcategoryValidator = (req, res, next) => {
    const updateSubcategoryFormat = {
        name: "required|string|between:1,255",
        id: "required|integer",
        categoryId: "required|integer"
    }

    const id = req.params.id
    const { name, categoryId } = req.body

    const validation = new Validator(
        { id, name, categoryId },
        updateSubcategoryFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })

    return next()
}

const deleteSubcategoryValidator = (req, res, next) => {
    const deleteSubcategoryFormat = {
        id: "required|integer"
    }

    const id = req.params.id

    const validation = new Validator(
        { id },
        deleteSubcategoryFormat
    )

    if (validation.fails())
        return res.status(400).send({ data: validation.errors })
    
    return next()
}


module.exports = {
    createItemValidator,
    getItemByIdValidator,
    updateItemValidator,
    deleteItemValidator,
    createTagValidator,
    getTagByIdValidator,
    updateTagValidator,
    deleteTagValidator,
    assignTagToItemValidator,
    createCategoryValidator,
    getCategoryByIdValidator,
    updateCategoryValidator,
    deleteCategoryValidator,
    createSubcategoryValidator,
    getSubcategoryByIdValidator,
    updateSubcategoryValidator,
    deleteSubcategoryValidator
}
