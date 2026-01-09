import { connect } from "mongoose";

const mongodbUrl = process.env.MONGODB_URI;

if (!mongodbUrl) {
  throw new Error("mongodb url is not found");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = connect(mongodbUrl).then((c) => c.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    throw error;
  }

  return cached.conn;
};

export default dbConnect;

// import mongoose from "mongoose";

// type ConnectionObject = {
//     isConnected?: number
// }

// const connection : ConnectionObject = {}

// async function dbConnect () : Promise<void> {
//     if(connection.isConnected) {
//         console.log("Already connected to database");
//         return
//     }
//     try {
//        const db = await mongoose.connect(process.env.MONGODB_URI || "",{})

//       connection.isConnected =  db.connections[0].readyState
//       console.log("DB Connected successfully");

//     } catch (error){
//         console.log("DB Connection failed",error);
//         process.exit(1)

//     }

// }

// export default dbConnect
