"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

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
import { CategorySchema } from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useTransition } from "react";
import { createCategory } from "@/actions/category.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const CreateAlertCategory = ({ b_id }) => {
  const [isPending, startTransition] = useTransition(false);
  const [Open, setOpen] = useState(false);
  const [isMounted, setisMounted] = useState(false);
  const { refresh } = useRouter();

  const form = useForm({
    resolver: zodResolver(CategorySchema),
  });
  function onSubmit(values) {
    startTransition(async () => {
      const { error } = await createCategory(
        values.name,
        values.desc,
        b_id
      );

      if (error) {
        toast.error(error);
      }

      if (!error) {
        toast.success("category saved");
        setOpen(false);
        refresh();
      }
    });
  }

  useEffect(() => {
    setisMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <AlertDialog open={Open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button
          size="sm"
          className="flex mt-2 bg-rose-500 hover:bg-rose-500 text-white items-center space-x-2"
        >
          <PlusCircle />
          <div>Category</div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>create a category</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Description</FormLabel>
                  <FormControl>
                    <Textarea disabled={isPending} placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              type="submit"
              className="w-full bg-rose-500 text-white hover:bg-rose-700"
            >
              Save
            </Button>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
