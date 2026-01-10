import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { data } = await req.json();
  
  return NextResponse.json({
    data,
    message: 'Sheet data updated successfully'
  });
}