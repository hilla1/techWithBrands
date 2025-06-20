import { z } from "zod";

const commonSchema = z.object({
  paymentMethod: z.enum(["stripe", "mpesa", "paypal"]),
});

const stripeFields = z.object({
  cardholderName: z.string().min(2, "Name must be at least 2 characters"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryMonth: z.string().min(1, "Select expiry month"),
  expiryYear: z.string().min(1, "Select expiry year"),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
});

const mpesaFields = z.object({
  phone: z.string().regex(/^\d{10,12}$/, "Enter valid phone number"),
});

export const paymentSchema = commonSchema.and(
  z.union([
    z.object({ paymentMethod: z.literal("stripe") }).and(stripeFields),
    z.object({ paymentMethod: z.literal("mpesa") }).and(mpesaFields),
    z.object({ paymentMethod: z.literal("paypal") }),
  ])
);
