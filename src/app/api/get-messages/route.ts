import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import  Mongoose from 'mongoose';


export async function GET(request: Request) { 
    await dbConnect() 

    const session = await getServerSession(authOptions)

    const user  = session?.user


    if (!session || !user) {
        return Response.json({success: false, message: "Unauthorized"}, {status: 401})
    }

    const UserId = new Mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: UserId }},
            {$unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id : '$_id', messages : {$push : "$messages"}} },

        ])
        if(!user || user.length === 0) {
            return Response.json({success: false, message: "no user found"}, {status: 404})
        }
        return Response.json({success: true, messages: user[0].messages}, {status: 200})
    
    
    
    
    
    
    
    
    } 
    
    
    
    
    
    catch (error) {
        console.log("an unexpected error occured",error);
        return Response.json({success: false, message: "Internal Server Error"}, {status: 500})
    }

}