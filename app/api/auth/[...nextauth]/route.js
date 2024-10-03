import { AuthOptions } from "@/utils/auth-options";
import nextAuth from "next-auth";

const handler = nextAuth(AuthOptions);

export { handler as GET, handler as POST };