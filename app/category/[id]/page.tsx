import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const category = await prisma.category.findUnique({
        where: { id },
    });

    if (!category) return notFound();

    const products = await prisma.product.findMany({
        where: { categoryId: id },
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="p-8">
            <Link href="/" className="text-sm text-gray-500 hover:underline">
                ← Back to home
            </Link>
            <h1 className="text-3xl font-bold my-6">{category.name}</h1>

            {products.length === 0 ? (
                <p className="text-gray-500">No products in this category yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link key={product.id} href={`/products/${product.id}`}>
                            <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                                {product.imageUrl && (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-40 object-cover rounded mb-3"
                                    />
                                )}
                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                <p className="mt-2 font-bold">₹{product.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}