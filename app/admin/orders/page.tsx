import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminOrdersPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    if (session.user.role !== "ADMIN") {
        redirect("/");
    }

    const orders = await prisma.order.findMany({
        include: {
            user: true,
            items: { include: { product: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="max-w-4xl mx-auto px-6 py-10">
            <Link href="/admin" className="text-sm text-indigo-600 hover:underline">
                ← Back to admin
            </Link>
            <h1 className="text-3xl font-bold tracking-tight my-6">Admin — Orders</h1>

            <div className="flex flex-col gap-4">
                {orders.map((order) => (
                    <Link
                        key={order.id}
                        href={`/admin/orders/${order.id}`}
                        className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition block"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">Order #{order.id.slice(-8)}</p>
                                <p className="text-sm text-gray-500">{order.user.email}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                    {" · "}
                                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">₹{order.totalPrice}</p>
                                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}