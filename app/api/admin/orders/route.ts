import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    try {
        const { orderId, status } = await request.json();

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("PATCH /api/admin/orders error:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}