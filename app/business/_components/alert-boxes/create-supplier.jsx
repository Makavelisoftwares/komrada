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
import { SupplierSchema } from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreateSupplier } from "@/actions/supplier.action";

export const CreateAlertSupplier = ({ b_id }) => {
  const [isPending, startTransition] = useTransition(false);
  const [Open, setOpen] = useState(false);
  const [isMounted, setisMounted] = useState(false);
  const { refresh } = useRouter();

  const form = useForm({
    resolver: zodResolver(SupplierSchema),
  });
  function onSubmit(values) {
    startTransition(async () => {
      const { error } = await CreateSupplier(
        b_id,
        values.name,
        values.email,
        values.address,
        values.phone
      );

      if (error) {
        toast.error(error);
      }

      if (!error) {
        toast.success("supplier saved");
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
          <div>Supplier</div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>create a supplier</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Name</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier's Email</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier's Address</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="" {...field} />
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
