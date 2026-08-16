import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CartItemControls from "@/app/components/CartItemControls";

export default async function CartPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border rounded-lg p-4"
            >
              <div>
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-sm text-gray-500">₹{item.product.price}</p>
              </div>
              <CartItemControls itemId={item.id} quantity={item.quantity} />
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      )}
    </main>
  );
}