import { getServerSession } from "next-auth"
import { AuthOptions } from "./auth-options"
import { db } from "./db";

export const getUserByEmail=async()=>{
    const session=await getServerSession(AuthOptions);
    const email=session?.user?.email

    const User=await db.user.findUnique({
        where:{
            email
        }
    })

    return {user:User}
}