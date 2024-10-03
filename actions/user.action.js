"use server";

import { GenereteCode } from "@/lib/generate-code";
import { AuthOptions } from "@/utils/auth-options";
import { db } from "@/utils/db";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";

import nodemailer from "nodemailer";

export const createUser = async (values) => {
  const { code } = GenereteCode();
  const { firstname, lastname, password, email } = values;

  if (!firstname || !lastname || !password || !email) {
    return { error: "check your fields" };
  }

  if (!code) {
    return { error: "system failed generating code" };
  }

  const findUser = await db.user.findMany({
    where: {
      email,
    },
  });

  if (findUser.length == 1) {
    return { error: "Email already exists" };
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      firstname,
      lastname,
      password: hashPassword,
      name: `${firstname} ${lastname}`,
      code,
      email,
    },
  });

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  let mailoptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Verification Code",
    text: `Your verication code is ${user?.code}`,
  };

  await transporter.sendMail(mailoptions);

  return { user };
};







export const VerifyAccountByCode = async (code, id) => {
  const findUser = await db.user.findUnique({
    where: {
      id,
    },
  });

  // let transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: process.env.GMAIL_USER,
  //     pass: process.env.GMAIL_PASSWORD,
  //   },
  // });

  // let mailoptions = {
  //   from: process.env.GMAIL_USER,
  //   to: email,
  //   subject: "Verification Code",
  //   text: `Your verication code is ${findUser?.code}`,
  // };

  // await transporter.sendMail(mailoptions);

  if (findUser?.code !== code) {
    return { error: "invalid code" };
  }

  await db.user.update({
    data: {
      verified: true,
    },
    where: {
      id,
    },
  });

  return { success: "Account has been verified" };
};






export const findEmailAndSendCode = async (email) => {
  const findUser = await db.user.findMany({
    where: {
      email,
    },
  });

  if (findUser.length == 0) {
    return { error: "invalid email for password reset" };
  }

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  }); 

  let mailoptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Reset password Code",
    text: `Your reset ppassword code is ${findUser[0].code}`,
  };

  await transporter.sendMail(mailoptions);

  return { id: findUser[0].id };
};






export const ResetPassword = async (code, password, id) => {
  const findUser = await db.user.findUnique({
    where: {
      id,
    },
  });

  if (findUser.code !== code) {
    return { error: "Invalid code" };
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    data: {
      password: hashPassword,
    },
    where: {
      id,
    },
  });

  return { success: "new password has been set" };
};







export const searchUserUsingEmailInLogin = async () => {
  const { user: AuthorizedUser } = await getServerSession(AuthOptions);
  const findDbUser = await db.user.findMany({
    where: {
      email: AuthorizedUser.email,
    },
  });

  return { id: findDbUser[0].id };
};
