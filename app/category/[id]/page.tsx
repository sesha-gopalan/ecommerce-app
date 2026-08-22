import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CategoryPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ specs?: string }>;
}) {
    const { id } = await params;
    const { specs } = await searchParams;

    const category = await prisma.category.findUnique({
        where: { id },
    });

    if (!category) return notFound();

    const allProductsInCategory = await prisma.product.findMany({
        where: { categoryId: id },
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    // Collect every unique spec that appears across products in this category
    const allSpecs = Array.from(
        new Set(allProductsInCategory.flatMap((p) => p.specs))
    ).sort();

    const selectedSpecs = specs ? specs.split(",").filter(Boolean) : [];

    const products =
        selectedSpecs.length === 0
            ? allProductsInCategory
            : allProductsInCategory.filter((p) =>
                selectedSpecs.every((s) => p.specs.includes(s))
            );

    function specToggleHref(spec: string) {
        const isSelected = selectedSpecs.includes(spec);
        const next = isSelected
            ? selectedSpecs.filter((s) => s !== spec)
            : [...selectedSpecs, spec];
        return next.length > 0 ? `?specs=${encodeURIComponent(next.join(","))}` : "?";
    }

    return (
        <main className="p-8">
            <Link href="/" className="text-sm text-gray-500 hover:underline">
                ← Back to home
            </Link>
            <h1 className="text-3xl font-bold my-6">{category.name}</h1>

            {allSpecs.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                    {allSpecs.map((spec) => {
                        const isSelected = selectedSpecs.includes(spec);
                        return (
                            <Link
                                key={spec}
                                href={specToggleHref(spec)}
                                className={`text-sm px-3 py-1 rounded-full border ${isSelected
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                                    }`}
                            >
                                {spec}
                            </Link>
                        );
                    })}
                    {selectedSpecs.length > 0 && (
                        <Link
                            href="?"
                            className="text-sm px-3 py-1 text-gray-500 hover:underline self-center"
                        >
                            Clear filters
                        </Link>
                    )}
                </div>
            )}

            {products.length === 0 ? (
                <p className="text-gray-500">No products match these filters.</p>
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
                                {product.specs.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {product.specs.join(" · ")}
                                    </p>
                                )}
                                <p className="mt-2 font-bold">₹{product.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}