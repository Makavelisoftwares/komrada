import { NextResponse } from "next/server";
import fetch from "node-fetch";

const generatePassword = (shortCode, passkey, timestamp) => {
  const buff = Buffer.from(`${shortCode}${passkey}${timestamp}`);
  return buff.toString("base64");
};

const generateAccessToken = async (consumerKey, consumerSecret) => {
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );
  const response = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data.access_token;
};

export const POST = async (req) => {
  const { id } = await req.json();

  try {
    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const password = generatePassword(
      process.env.MPESA_SHORT_CODE,
      process.env.MPESA_PASSKEY,
      timestamp
    );

    const accessToken = await generateAccessToken(
      process.env.MPESA_CONSUMER_KEY,
      process.env.MPESA_CONSUMER_SECRET
    );

    //   const CheckoutRequestID = responseData.CheckoutRequestID;
    const responsePayload = {
      BusinessShortCode: process.env.MPESA_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: id,
    };

    const checkoutresonse = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(responsePayload),
      }
    );

    return NextResponse.json(checkoutresonse, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
};
