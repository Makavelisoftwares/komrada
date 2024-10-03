"use server";
import { db } from "@/utils/db";
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

export const stkPush = async (phoneNumber, amount) => {
  let new_num = phoneNumber.slice(1, 10);

  let phone_number = parseInt(`254${new_num}`);

  let new_amount = parseFloat(amount);

  let responseData;
  let response;
  const date = new Date();
  let timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

  let password = generatePassword(
    process.env.MPESA_SHORT_CODE,
    process.env.MPESA_PASSKEY,
    timestamp
  );

  let accessToken = await generateAccessToken(
    process.env.MPESA_CONSUMER_KEY,
    process.env.MPESA_CONSUMER_SECRET
  );
  const requestPayload = {
    BusinessShortCode: process.env.MPESA_SHORT_CODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: new_amount,
    PartyA: phone_number,
    PartyB: process.env.MPESA_SHORT_CODE,
    PhoneNumber: phone_number,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: "TestAccount",
    TransactionDesc: "Payment for services",
  };
  response = await fetch(process.env.MPESA_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestPayload),
  });
  responseData = await response.json();
  console.log("responseData", responseData);

  if (!response.ok) {
    return { error: "invalid amount or phone number" };
  } else {
    await new Promise((resolve) => setTimeout(resolve, 4000));

    try {
      const CheckoutRequestID = responseData.CheckoutRequestID;
      const responsePayload = {
        BusinessShortCode: process.env.MPESA_SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID,
      };

      const CheckOutQueryResponse = await fetch(
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

      const data = await CheckOutQueryResponse.json();

      console.log("data", data);

      if (!data.ResultCode) {
        return {
          error:
            "Transaction failed: Kindly retry the transaction process again.",
        };
      }

      if (data.ResultCode == "2001") {
        return {
          error: "Transaction failed: Client provided an invalid pin",
        };
      }

      if (data.ResultCode == "1032") {
        return {
          error: "Transaction failed: Client cancelled the transaction",
        };
      }

      if (data.ResultCode == "8006") {
        return {
          error:
            "Transaction failed: Client's mpesa security credential is locked .Dial *334# to unlock ",
        };
      }

      if (data.ResultCode == "1") {
        return {
          error:
            "Transaction failed: Insuccient balance from customer account.",
        };
      }

      return { valid: "payment successful" };
    } catch (error) {
      console.log("checkout", error);
    }
  }
};

export const PaidViaMpesa = async (
  invoice,
  orderId,
  total_amount,
  businessId
) => {
  const createPayments = await db.payment.create({
    data: {
      orderId,
      invoice,
      total_amount:parseFloat(total_amount),
      BusinessId: businessId,
      type: "MPESA",
    },
  });

  return { ok: "ok" };
};

export const MakeDeduction = async (productId, count) => {
  const getproduct = await db.product.findUnique({
    where: {
      id: productId,
    },
  });

  const deduct = await db.product.update({
    data: {
      quantity: getproduct.quantity - count,
    },
    where: {
      id: productId,
    },
  });

  return { ok: "ok" };
};
