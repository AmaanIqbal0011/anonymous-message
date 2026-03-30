import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import Mongoose from 'mongoose';


export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user  = session?.user


    if (!session || !user) {
        return Response.json({success: false, message: "Unauthorized"}, {status: 401})
    }

    const UserId = new Mongoose.Types.ObjectId(user._id);

    try {
        const foundUser = await UserModel.findById(UserId)
        
        if(!foundUser) {
            return Response.json({success: false, message: "User not found"}, {status: 404})
        }
        
        // Return messages array (could be empty)
        return Response.json({
            success: true, 
            messages: foundUser.messages || []
        }, {status: 200})

    } catch (error) {
        console.log("an unexpected error occured",error);
        return Response.json({success: false, message: "Internal Server Error"}, {status: 500})
    }

}