import { NextResponse } from "next/server"; 
import { auth } from "@/auth"; 
import { prisma } from "@/lib/prisma"; 
export async function POST(request: Request) { 
    const session = await auth(); 
    if (!session?.user?.id) { 
        return NextResponse.json({ error: "You must be logged in" }, { status: 401 }); 
    } 
    const { productId, quantity } = await request.json(); 
    const cart = await prisma.cart.upsert({ where: { userId: session.user.id }, create: { userId: session.user.id }, update: {}, }); 
    const cartItem = await prisma.cartItem.upsert({ where: { cartId_productId: { cartId: cart.id, productId }, }, create: { cartId: cart.id, productId, quantity: quantity || 1 }, update: { quantity: { increment: quantity || 1 } }, }); 
    return NextResponse.json(cartItem); 
}