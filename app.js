const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

const MenuItemRouter = require("./routers/MenuItemRouter")
const TagRouter = require("./routers/TagRouter")
const CategoryRouter = require("./routers/CategoryRouter")
const SubcategoryRouter = require("./routers/SubcategoryRouter")

app.use("/items", MenuItemRouter)
app.use("/tags", TagRouter)
app.use("/categories", CategoryRouter)
app.use("/subcategories", SubcategoryRouter)

module.exports = app
