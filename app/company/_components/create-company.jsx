"use client";

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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CompanySchema } from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createBusiness } from "@/actions/business.action";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { useTransition } from "react";
import { Loader } from "lucide-react";

export const CreateCompany = ({ userId }) => {
  const [isPending, startTransition] = useTransition(false);
  const form = useForm({
    resolver: zodResolver(CompanySchema),
  });

  function onSubmit(values) {
    startTransition(async () => {
      const name = values.name;
      const { error, id } = await createBusiness(userId, name);

      if (error) {
        return toast.error(error);
      }

      if (id) {
        redirect(`/business/${id}`);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Business</CardTitle>
        <CardDescription>
          create a your business by first providing a business name
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    The business name you provide will be displayed on your
                    inventory system dashboard
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              type="submit"
              className="w-full bg-sky-700 hover:bg-sky-700"
            >
              {isPending ? (
                <div className="flex items-center space-x-1">
                  <Loader className="animate-spin" />
                  <div>saving</div>
                </div>
              ) : (
                <div>save</div>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
