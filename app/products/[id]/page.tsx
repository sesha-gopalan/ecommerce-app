import AddToCartButton from "@/app/components/AddToCartButton";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
export default async function ProductPage({ params, }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true }, });
    if (!product) return notFound();
    return (
        <main className="max-w-2xl mx-auto px-6 py-10">
            {product.imageUrl && (
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-72 object-cover rounded-2xl mb-6 shadow-sm"
                />
            )}
            <p className="text-sm text-indigo-600 font-medium mb-1">
                {product.category?.name}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            {product.specs && product.specs.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">{product.specs.join(" · ")}</p>
            )}
            <p className="mt-4 text-gray-700">{product.description}</p>
            <p className="mt-6 text-3xl font-bold">₹{product.price}</p>
            <p className="mt-1 text-sm text-gray-500">{product.stock} in stock</p>
            <AddToCartButton productId={product.id} />
        </main>
    );
}