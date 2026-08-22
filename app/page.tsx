import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const products = await prisma.product.findMany({
    where: {
      AND: [
        q
          ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
          : {},
        category ? { category: { name: category } } : {},
      ],
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <form className="flex flex-wrap gap-3 mb-8" method="get">
        <input
          type="text"
          name="q"
          placeholder="Search products..."
          defaultValue={q || ""}
          className="border rounded p-2 flex-1 min-w-[200px]"
        />
        <select
          name="category"
          defaultValue={category || ""}
          className="border rounded p-2"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800"
        >
          Filter
        </button>
        {(q || category) && (
          <Link
            href="/"
            className="text-sm text-gray-500 self-center hover:underline"
          >
            Clear filters
          </Link>
        )}
      </form>

      {products.length === 0 ? (
        <p className="text-gray-500">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.category?.name}</p>
                <p className="mt-2">{product.description}</p>
                <p className="mt-2 font-bold">₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}