import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  if (q) {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <SearchBar defaultValue={q} />
        <h1 className="text-2xl font-bold mb-6">
          Results for &quot;{q}&quot;
        </h1>
        {products.length === 0 ? (
          <p className="text-gray-500">No products match your search.</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </main>
    );
  }

  const sections = await Promise.all(
    categories.map(async (category) => {
      const products = await prisma.product.findMany({
        where: { categoryId: category.id },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 4,
      });
      return { category, products };
    })
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <SearchBar defaultValue="" />

      {sections
        .filter((section) => section.products.length > 0)
        .map((section) => (
          <div key={section.category.id} className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{section.category.name}</h2>
              <Link
                href={`/category/${section.category.id}`}
                className="text-sm text-indigo-600 hover:underline"
              >
                View all →
              </Link>
            </div>
            <ProductGrid products={section.products} />
          </div>
        ))}
    </main>
  );
}

function SearchBar({ defaultValue }: { defaultValue: string }) {
  return (
    <form method="get" className="flex gap-3 mb-8">
      <input
        type="text"
        name="q"
        placeholder="Search products..."
        defaultValue={defaultValue}
        className="border rounded-full px-4 py-2.5 flex-1 max-w-md"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white rounded-full px-6 py-2.5 font-medium hover:bg-indigo-700 transition"
      >
        Search
      </button>
      {defaultValue && (
        <Link href="/" className="text-sm text-gray-500 self-center hover:underline">
          Clear
        </Link>
      )}
    </form>
  );
}

type ProductWithCategory = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: { name: string } | null;
};

function ProductGrid({ products }: { products: ProductWithCategory[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <div className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover rounded-xl mb-3"
              />
            )}
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category?.name}</p>
            <p className="mt-2 font-bold">₹{product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}