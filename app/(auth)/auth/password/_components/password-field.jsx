"use client";

import { findEmailAndSendCode } from "@/actions/user.action";
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
import { PasswordFormSchema } from "@/validation/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const PasswordField = () => {
  const form = useForm({
    resolver: zodResolver(PasswordFormSchema),
  });
  const { push } = useRouter();
  const [newError, setnewError] = useState("");
  const [success, setsuccess] = useState("");

  async function onSubmit(values) {
    const email = values.email;
    const { error, id } = await findEmailAndSendCode(email);

    if (error) {
      setnewError(error);
      setsuccess("");
    }

    if (id) {
      setnewError("");
      setsuccess("Code has been sent");

      push(`/auth/new-password?id=${id}`);
    }
  }

  return (
    <div className="w-[350px]">
      {newError !== "" && (
        <div className="p-2 text-rose-500 bg-rose-200 border border-rose-500 text-sm">
          {newError}
        </div>
      )}

      {success !== "" && (
        <div className="p-2 text-emerald-500 bg-emerald-200 border border-emerald-500 text-sm">
          {success}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Email address</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" {...field} />
                </FormControl>
                <FormDescription>
                  code will be sent to this email .Use the code to reset your
                  password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full bg-sky-700 hover:bg-sky-700" type="submit">
            send code
          </Button>
        </form>
      </Form>
    </div>
  );
};
