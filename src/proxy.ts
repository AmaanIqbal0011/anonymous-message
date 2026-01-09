import { url } from "inspector";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";



export async function proxy(req:NextRequest){
   const {pathname}=req.nextUrl
   const publicRoutes=[
    "/sign-in",
    "/sign-up",
    "/verify",
    "/",
    "/favicon.ico","_next"
   ]
   if(publicRoutes.some(path=>pathname.startsWith(path))){
    return NextResponse.next()
   }

   const signIn="/sign-in"

   const privateRoutes=[
    "/dashboard",
   ]
   if(publicRoutes.some(path=>pathname.startsWith(path))){
    return NextResponse.redirect(signIn)
   }
   
const token=await getToken({req,secret:process.env.NEXT_AUTH_SECRET})

// if(!token){
//     const loginUrl=new URL("/sign-in",req.url)
//     loginUrl.searchParams.set("callbackUrl",req.url)
//     return NextResponse.redirect(loginUrl)
// }
 return NextResponse.next()
  
}

export const config ={
matcher:"/((?!api|_next/static|_next/image|favicon.ico|node_modules).*)"
}


// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// export async function proxy(req: NextRequest) {
//   const token = await getToken({ req });
//   const pathname = req.nextUrl.pathname

//   if (
//     token &&
//     (pathname.startsWith("/sign-in") ||
//       pathname.startsWith("/sign-up") ||
//       pathname.startsWith("/verify") ||
//       pathname === "/")
//   ) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//     console.log("TOKEN 👉", token)

//   }
 
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
// };
