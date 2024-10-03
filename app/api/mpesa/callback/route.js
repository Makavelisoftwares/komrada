// app/api/mpesa/callback.js

import { NextResponse } from "next/server";

export async function POST(req) {
  const { body } = await req.json();
  try {
    // Handle the callback logic
    console.log("M-Pesa Callback Received:", body);

    if (body.stkCallback.ResultCode !== "0") {
      // const stkmetadata=body.stkCallback.CallbackMetadata

      return NextResponse.json("error", { status: 400 });
    }
    // ResultCode:1032->clicked the cancel button

    // ResultCode:2001->incorrect password
    // ResultCode:0->successful

    const stkmetadata = body.stkCallback.CallbackMetadata;

    // You can add logic here to verify the payment, log it, etc.

    return NextResponse.json(stkmetadata, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(body, { status: 400 });
  }
}
