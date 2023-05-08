const app = require("./app")
const sequelize = require("./sequelizeConnection").sequelize

sequelize.authenticate()
    .then(() => {
        console.log("Connected to menu items database successfully")
        console.log("Starting db synchronization")
        sequelize.sync().then(() => {
            console.log("Db synchronization successful")
            app.listen(5000, () => {
                console.log("Menu items service listening on http://localhost:5000")
            })
        }).catch((err) => {
            console.log("Unable to sync the models with the database", err)
        })
    }).catch((err) => {
        console.log("Unable to connect to menu items database", err)
    })
