import { PrismaClient } from "@prisma/client"; 
import { PrismaPg } from "@prisma/adapter-pg"; 
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL }); 
const prisma = new PrismaClient({ adapter });
async function main() { 
const electronics = await prisma.category.create({ data: { name: "Electronics" }, }); 
await prisma.product.createMany({ data: [ { name: "Wireless Headphones", description: "Noise-cancelling over-ear headphones", price: 2999, stock: 25, categoryId: electronics.id, }, { name: "Smart Watch", description: "Fitness tracking smart watch", price: 4999, stock: 15, categoryId: electronics.id, }, { name: "Bluetooth Speaker", description: "Portable waterproof speaker", price: 1999, stock: 40, categoryId: electronics.id, }, ], }); 
console.log("Seed data created successfully"); 
} 
main() .catch((e) => console.error(e)) .finally(() => prisma.$disconnect());
