import { NextResponse } from "next/server";

export function successResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 500, details?: any) {
  return NextResponse.json(
    { error: message, ...(details && { details }) },
    { status }
  );
}
