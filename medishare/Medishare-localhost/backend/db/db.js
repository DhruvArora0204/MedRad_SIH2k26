import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance =await mongoose.connect(process.env.MONGODB_URI) ; 
        console.log("connected to mongo db " , connectionInstance.connection.host) ;
        
    } catch (error) {
        console.log(" error while connecting to mongo db " , error ) ;
        process.exit(1) ;
    }
}


export default connectDB ; 