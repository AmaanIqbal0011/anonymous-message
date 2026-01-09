import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

interface DeleteMessageParams {
  params: Promise<{
    messageid: string;
  }>;
}

export async function DELETE(
  request: Request,
  { params }: DeleteMessageParams
) {
  // Await params in Next.js 15+
  const { messageid } = await params;
  
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      {
        _id: user._id,
      },
      {
        $pull: { messages: { _id: messageid } },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}