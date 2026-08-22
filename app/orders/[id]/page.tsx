import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order || order.userId !== session.user.id) {
    return notFound();
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          ✓
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Order Confirmed!</h1>
        <p className="text-gray-500 mt-1">Order #{order.id.slice(-8)}</p>
      </div>
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between border-b pb-2">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
          <span>Total Paid</span>
          <span>₹{order.totalPrice}</span>
        </div>
      </div>
    </main>
  );
}