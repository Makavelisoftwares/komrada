import { z } from "zod";

export const PasswordFormSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
    })
    .email({
      message: "enter a valid email",
    }),
});

export const VerificationCodeSchema = z.object({
  code: z
    .string({
      required_error: "verification code is required",
    })
    .min(6, {
      message: "minimum of 6 characters",
    })
    .max(6, {
      message: "maximum of 6 characters",
    }),
});

export const ResetPasswordFormSchema = z.object({
  code: z
    .string({
      required_error: "code is required",
    })
    .min(6, {
      message: "minimum of 6 characters",
    })
    .max(6, {
      message: "maximum of 6 characters",
    }),
  password: z
    .string({
      required_error: "new password is required",
    })
    .min(8, {
      message: "minimum of 8 characters",
    }),
});

export const CompanySchema = z.object({
  name: z
    .string({
      required_error: "provide a name for your business",
    })
    .min(2, {
      message: "name should be atleast 2 characters",
    }),
});

export const CategorySchema = z.object({
  name: z
    .string({
      required_error: "provide a name for your category",
    })
    .min(2, {
      message: "name should be atleast 2 characters",
    }),
  desc: z
    .string({
      required_error: "provide a description for your category",
    })
    .min(10, {
      message: "name should be atleast 10 characters",
    }),
});

export const SupplierSchema = z.object({
  name: z
    .string({
      required_error: "provide supplier's name",
    })
    .min(2, {
      message: "name should be atleast 2 characters",
    }),
  email: z
    .string({
      required_error: "provide supplier's email",
    })
    .email({ message: "provide a valid email" }),
  address: z.string({
    required_error: "provide supplier's address",
  }),
  phone: z.string({
    required_error: "provide supplier's phone number",
  }),
});

export const ProductSchema = z.object({
  name: z
    .string({
      required_error: "provide product's name",
    })
    .min(2, {
      message: "name should be atleast 2 characters",
    }),
  desc: z.string({
    required_error: "provide product description",
  }),
  category: z.string({
    required_error: "select a category for your product",
  }),
  supplier: z.string({
    required_error: "select a supplier for the product",
  }),
  cost_price: z.string({
    required_error: "provide cost price for the product",
  }),
  sell_price: z.string({
    required_error: "provide selling price for the product",
  }),
  quantity: z.string({
    required_error: "provide quantity for the product",
  }),
});

export const MpesaSchema = z.object({
  phone: z
    .string({
      required_error: "phone number is required",
    })
    .min(10, {
      message: "minimum of 10 digits",
    })

    .max(10, {
      message: "maximum of 10 digits",
    }),
});
