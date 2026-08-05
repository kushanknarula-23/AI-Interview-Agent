import dotenv from "dotenv"
dotenv.config()
import redisClient from "./src/config/redis.js"
import app from "./src/app.js"
import connectDb from "./src/config/db.js"

const port = (process.env.PORT_NO || 6000)


try{
    connectDb()

    await redisClient.connect()

    app.listen(port,()=>{
        console.log(`Server running on the port no ${port}`)
    })
}
catch(error){
    console.log(error)
}