"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResetPasswordFormSchema } from "@/validation/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ResetPassword } from "@/actions/user.action";
import { useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export const NewPasswordField = () => {
  const form = useForm({
    resolver: zodResolver(ResetPasswordFormSchema),
  });
  const id = useSearchParams().get("id");
  const [newError, setnewError] = useState("");
  const [success, setsuccess] = useState("");
  const { push } = useRouter();

  const handleHide = () => {
    const password = document.querySelector(".password");
    if (password.type == "password") {
      password.type = "name";
    } else {
      password.type = "password";
    }
  };

  async function onSubmit(values) {
    const code = values.code;
    const password = values.password;
    const { error, success } = await ResetPassword(code, password, id);

    if (error) {
      setnewError(error);
      setsuccess("");
    }

    if (success) {
      setnewError("");
      setsuccess(success);

      push(`/auth/sign-in`);
    }
  }

  return (
    <div className="w-[350px]">
      {newError !== "" && (
        <div className="p-2 text-rose-500 font-bold text-center bg-rose-200 border border-rose-500 text-sm">
          {newError}
        </div>
      )}

      {success !== "" && (
        <div className="p-2 text-emerald-500 font-bold text-center bg-emerald-200 border border-emerald-500 text-sm">
          {success}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Enter code</FormLabel>
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

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  <div className="flex items-center justify-between w-full">
                    <div>password</div>
                    <div className="cursor-pointer" onClick={handleHide}>
                      <Eye />
                    </div>
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="password"
                    placeholder="********"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full bg-sky-700 hover:bg-sky-700" type="submit">
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  );
};
