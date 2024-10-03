// app/api/mpesa.js

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

export async function POST(req) {
  const { phoneNumber, amount, invoice } = await req.json();

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

  const requestPayload = {
    BusinessShortCode: process.env.MPESA_SHORT_CODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: process.env.MPESA_SHORT_CODE,
    PhoneNumber: phoneNumber,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: "TestAccount",
    TransactionDesc: "Payment for services",
  };

  const response = await fetch(process.env.MPESA_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestPayload),
  });

  const responseData = await response.json();

  if (response.ok) {
    return NextResponse.json(
      { success: true, data: responseData },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { success: false, error: responseData },
      { status: 400 }
    );
  }
}
