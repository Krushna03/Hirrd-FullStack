import { app } from './src/app.js'
import dotenv from 'dotenv'
import connectDB from './src/DataBase/index.js'


dotenv.config({
  path: "./env"
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000 , () =>{
      console.log(`Server is running at Port : ${process.env.PORT}`);
    })

    app.on("error" , (error) => {
    console.log('App error at app.on', error);
    throw error
    })
  })
.catch((error) => {
  console.log('MongoDBconnection failed !!!' , error);
})


