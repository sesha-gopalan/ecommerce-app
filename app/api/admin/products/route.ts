import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return null;
    }
    return session;
}

export async function POST(request: Request) {
    const session = await requireAdmin();
    if (!session) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    try {
        const { name, description, price, stock, categoryName, imageUrl, specs } = await request.json();

        const specsArray = specs
            ? specs.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0)
            : [];

        let categoryId: string | undefined;
        if (categoryName) {
            const category = await prisma.category.upsert({
                where: { name: categoryName },
                create: { name: categoryName },
                update: {},
            });
            categoryId = category.id;
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                category: categoryId ? { connect: { id: categoryId } } : undefined,
                imageUrl,
                specs: specsArray,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("POST /api/admin/products error:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
export async function PATCH(request: Request) {
    const session = await requireAdmin();
    if (!session) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    try {
        const { id, name, description, price, stock, categoryName, imageUrl, specs } = await request.json();

        const specsArray = specs
            ? specs.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0)
            : [];

        let categoryId: string | undefined;
        if (categoryName) {
            const category = await prisma.category.upsert({
                where: { name: categoryName },
                create: { name: categoryName },
                update: {},
            });
            categoryId = category.id;
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                category: categoryId ? { connect: { id: categoryId } } : undefined,
                imageUrl,
                specs: specsArray,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("PATCH /api/admin/products error:", error);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await requireAdmin();
    if (!session) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { id } = await request.json();

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
}