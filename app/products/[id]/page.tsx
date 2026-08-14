import { prisma } from "@/lib/prisma"; 
import { notFound } from "next/navigation"; 
export default async function ProductPage({ params, }: { params: Promise<{ id: string }>; }) { 
const { id } = await params; 
const product = await prisma.product.findUnique({ where: { id }, include: { category: true }, }); 
if (!product) return notFound(); 
return ( 
    <main className="p-8 max-w-2xl mx-auto"> 
    <h1 className="text-3xl font-bold">{product.name}</h1> 
    <p className="text-sm text-gray-500 mt-1">{product.category?.name}</p> 
    <p className="mt-4">{product.description}</p> 
    <p className="mt-4 text-2xl font-bold">₹{product.price}</p> 
    <p className="mt-2 text-sm text-gray-500">{product.stock} in stock</p> 
    </main> ); 
}