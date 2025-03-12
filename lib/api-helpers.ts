import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export function successResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 500, details?: any) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status }
  );
}

export async function withAuth(handler: Function) {
  return async (req: Request, context: any) => {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return errorResponse("Unauthorized", 401);
    }

    return handler(req, context, session.user);
  };
}
