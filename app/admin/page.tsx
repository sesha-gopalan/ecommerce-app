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
        <main className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin — Products</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800"
                >
                    + Add Product
                </Link>
            </div>

            <div className="flex flex-col gap-3">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex justify-between items-center border rounded-lg p-4"
                    >
                        <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-gray-500">
                                {product.category?.name} · ₹{product.price} · {product.stock} in stock
                            </p>
                        </div>
                        <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Edit
                        </Link>
                    </div>
                ))}
            </div>
        </main>
    );
}