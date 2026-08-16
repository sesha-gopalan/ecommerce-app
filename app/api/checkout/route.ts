import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(total * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  return NextResponse.json({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
}