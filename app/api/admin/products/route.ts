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

    const { name, description, price, stock, categoryName } = await request.json();

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
            categoryId,
        },
    });

    return NextResponse.json(product);
}
export async function PATCH(request: Request) {
    const session = await requireAdmin();
    if (!session) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { id, name, description, price, stock, categoryName } = await request.json();

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
            categoryId,
        },
    });

    return NextResponse.json(product);
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