import mongoose from "mongoose"

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.DB_CONNECTIONSTRING}/${process.env.DB_NAME}`)
        console.log('\n MONGODB connected successfully');
        
    }catch(err){
        console.log("Mongo DB connection failed \n");
        console.log(err)
        process.exit(1);
        
        
    }
}
export default connectDB