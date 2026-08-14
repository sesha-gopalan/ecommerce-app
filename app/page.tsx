import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const products = await prisma.product.findMany({
    include: { category: true },
  });

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.category?.name}</p>
              <p className="mt-2">{product.description}</p>
              <p className="mt-2 font-bold">₹{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}