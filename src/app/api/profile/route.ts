// api/profile/route.ts

import { getAuthenticatedUser } from "@/utility/auth";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  return Response.json(user);
}

