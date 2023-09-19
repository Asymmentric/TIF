const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const dbConnURL = process.env.DB_URL
const dbName = process.env.DB_NAME 

const dbConnection = mongoose.connect(dbConnURL, {
    dbName
})

dbConnection.then(()=>{
    console.log(`DB connected succesfully`)
})

dbConnection.catch((err)=>{
    console.log(`- - - - - - - - - - - - - Couldn't Connect to Database- - - - - - - - - - - - - -\n`)
    console.error(err)
})