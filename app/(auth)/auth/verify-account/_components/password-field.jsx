"use client";

import { VerifyAccountByCode } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { VerificationCodeSchema } from "@/validation/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const Verificationfield = () => {
  const id = useSearchParams().get("id");
  const { push } = useRouter();

  const [newError, setnewError] = useState("");
  const [newSuccess, setnewSuccess] = useState("");

  const form = useForm({
    resolver: zodResolver(VerificationCodeSchema),
  });

  async function onSubmit(values) {
    const code = values.code;
    const { error, success } = await VerifyAccountByCode(code, id);

    if (error) {
      setnewSuccess("");
      setnewError(error);
    }

    if (success) {
      setnewError("");
      setnewSuccess(success);

      push("/auth/sign-in");
    }
  }

  return (
    <div className="w-[350px]">
      {newError !== "" && (
        <div className="text-sm p-2 text-center bg-rose-200 text-rose-500 font-bold border border-rose-500">
          {newError}
        </div>
      )}

      {newSuccess !== "" && (
        <div className="text-sm bg-emerald-200 p-2 text-center text-emerald-500 font-bold border border-emerald-500">
          {newSuccess}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="w-full flex items-center justify-evenly">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Enter code sent to your email to verify this account.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full bg-sky-700 hover:bg-sky-700" type="submit">
            verify account
          </Button>
        </form>
      </Form>
    </div>
  );
};
