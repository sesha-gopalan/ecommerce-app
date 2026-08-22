import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    if (session.user.role !== "ADMIN") {
        redirect("/");
    }

    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="max-w-4xl mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Admin — Products</h1>
                <div className="flex gap-3">
                    <Link
                        href="/admin/orders"
                        className="border rounded-full px-4 py-2 hover:bg-gray-50 transition text-sm font-medium"
                    >
                        View Orders
                    </Link>
                    <Link
                        href="/admin/products/new"
                        className="bg-indigo-600 text-white rounded-full px-4 py-2 hover:bg-indigo-700 transition text-sm font-medium"
                    >
                        + Add Product
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex justify-between items-center bg-white border rounded-2xl p-4 shadow-sm"
                    >
                        <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-gray-500">
                                {product.category?.name} · ₹{product.price} · {product.stock} in stock
                            </p>
                        </div>
                        <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="text-sm text-indigo-600 hover:underline font-medium"
                        >
                            Edit
                        </Link>
                    </div>
                ))}
            </div>
        </main>
    );
}