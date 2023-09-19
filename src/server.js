const express=require('express')
const cookieParser=require('cookie-parser')

const { router } = require('./api/api')
const { notFoundHandler } = require('./utils/utils')

const app=express()

const port=process.env.PORT || 9099

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())

app.use((error, req, res, next) => {
    
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        console.log(error)
      res.status(400).send({
        status:false,
        errors:[
            {message:'Invalid JSON format'}
        ]
      });
    } else {
      next();
    }
  });
  

router(app)

app.use('*',notFoundHandler)

app.listen(port,()=>{
    console.log(`Active on ${port}`)
})

module.exports={app}