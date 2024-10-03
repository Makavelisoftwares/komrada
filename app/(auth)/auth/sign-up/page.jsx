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

import React, { useState } from "react";

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
import { createUser } from "@/actions/user.action";

const formSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
    })
    .email({
      message: "enter a valid email",
    }),
  firstname: z.string({
    required_error: "firstname is required",
  }),
  lastname: z.string({
    required_error: "lastname is required",
  }),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(8, {
      message: "password must be atleast 8 characters",
    }),
});

function SignUpPage() {
  const [isSubmitting, setisSubmitting] = useState(false);
  const { push } = useRouter();
  const [newError, setError] = useState("");
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
    const { error, user } = await createUser(values);

    if (error) {
      setError(error);
    }

    if (user) {
      setError("");
      push(`/auth/verify-account?id=${user.id}`);
    }
  }

  return (
    <Card className="mx-auto md:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Start your journey by creating an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {newError !== "" && (
          <div className="text-sm bg-rose-200 mb-2 font-bold text-rose-500 p-2 border border-rose-500">
            {newError}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">first name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="John"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className="text-rose-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">last name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="Doe"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage className="text-rose-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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
                    </div>{" "}
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="password"
                      placeholder="*******"
                      className="password"
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
                    <div>creating account</div>
                  </div>
                ) : (
                  <div>Create account</div>
                )}
              </Button>
            </div>
          </form>
        </Form>

        <Separator className="my-2" />
        <div className="flex items-center justify-center">
          <Link className="text-xs underline text-center" href="/auth/sign-in">
            Already have an account?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default SignUpPage;
