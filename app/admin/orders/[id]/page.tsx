import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import OrderStatusSelect from "@/app/components/OrderStatusSelect";
import Link from "next/link";

export default async function AdminOrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    if (session.user.role !== "ADMIN") {
        redirect("/");
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: { user: true, items: { include: { product: true } } },
    });

    if (!order) return notFound();

    return (
        <main className="max-w-2xl mx-auto px-6 py-10">
            <Link href="/admin/orders" className="text-sm text-indigo-600 hover:underline">
                ← Back to orders
            </Link>
            <h1 className="text-2xl font-bold tracking-tight mt-4 mb-1">
                Order #{order.id.slice(-8)}
            </h1>
            <p className="text-gray-500 mb-1">{order.user.email}</p>
            <p className="text-gray-500 mb-6">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })}
            </p>

            <div className="bg-white border rounded-2xl p-6 shadow-sm mb-6">
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
                    <span>Total</span>
                    <span>₹{order.totalPrice}</span>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold mb-2">Order Status</label>
                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
            </div>
        </main>
    );
}