import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";






export async function POST(request: Request) {
    await dbConnect() 

    const session = await getServerSession(authOptions)

    const user  = session?.user


    if (!session || !user) {
        return Response.json({success: false, message: "Unauthorized"}, {status: 401})
    }

    const userId = user?._id

    const {acceptMessages} = await request.json()

    try {
      const updatedUser =  await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages : acceptMessages},
            {new: true})
            if(!updatedUser){
                return Response.json({success: false, message: "User not found"}, {status: 404})
            }
            return Response.json({success: true, message: "Message acceptance status updated successfully",updatedUser}, {status: 200})







    } catch (error) {
        console.log("failed to update user status to accept message",error);
         return Response.json({success: false, message: "failed to update user status"}, {status: 500})
    }
}


export async function GET(request: Request) {
    await dbConnect() 

    const session = await getServerSession(authOptions)

    const user  = session?.user


    if (!session || !user) {
        return Response.json({success: false, message: "Unauthorized"}, {status: 401})
    }

    const userId = user?._id

   try {
     const foundUser = await UserModel.findById(userId)
 
     if (!foundUser) {
         return Response.json({success: false,message: "User not found"}, {status: 404})
     }
 
     return Response.json({success: true, isAcceptingMessages: foundUser.isAcceptingMessages}, {status: 200})
   } catch (error) {
    console.log("failed to update user status to accept message",error);
         return Response.json({success: false, message: "error in getting message acceptance status "}, {status: 500})
    
   }
}
