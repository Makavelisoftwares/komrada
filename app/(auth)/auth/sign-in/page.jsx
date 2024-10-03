"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import React, { useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Eye, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { searchUserUsingEmailInLogin } from "@/actions/user.action";

const formSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
    })
    .email({
      message: "enter a valid email",
    }),

  password: z
    .string({
      required_error: "password is required",
    })
    .min(8, {
      message: "password must be atleast 8 characters",
    }),
});

function SignInPage() {
  const [isSubmitting, setisSubmitting] = useTransition(false);
  const { push } = useRouter();
  const [loginError, setloginError] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const handleHide = () => {
    const password = document.querySelector(".password");
    if (password.type == "password") {
      password.type = "name";
    } else {
      password.type = "password";
    }
  };

  async function onSubmit(values) {
    setisSubmitting(async () => {
      try {
        signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        })
          .then(async (res) => {
            if (res?.error) {
              setloginError(res.error);
            }

            if (!res?.error) {
              const { id } = await searchUserUsingEmailInLogin();
              push(`/company?id=${id}`);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    });
  }

  return (
    <Card className="mx-auto w-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Login to your Account</CardDescription>
      </CardHeader>
      <CardContent>
        {loginError && (
          <div className="p-2 text-sm font-bold text-rose-500 bg-rose-200 border border-rose-400 rounded-md">
            {loginError}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="m@example.com"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="text-rose-400 text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between text-black">
                    <div className="flex items-center justify-between w-full">
                      <div>password</div>
                      <div className="cursor-pointer" onClick={handleHide}>
                        <Eye />
                      </div>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="password"
                      className="password"
                      placeholder="*******"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="text-rose-400 text-xs" />
                </FormItem>
              )}
            />

            <div className="flex flex-col ">
              <Button
                className="bg-sky-500 hover:bg-sky-500"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <Loader className="animate-spin" />
                  </div>
                ) : (
                  <div>Login</div>
                )}
              </Button>
            </div>
          </form>
        </Form>

        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          <Link className="text-xs underline text-center" href="/auth/sign-up">
            Create Account
          </Link>

          <Link className="text-xs underline text-center" href="/auth/password">
            Reset password?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default SignInPage;
