import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function getItemIdFromUrl(request: Request): string {
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  return segments[segments.length - 1];
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  const itemId = getItemIdFromUrl(request);
  const { quantity } = await request.json();

  const updated = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  const itemId = getItemIdFromUrl(request);

  await prisma.cartItem.delete({ where: { id: itemId } });

  return NextResponse.json({ success: true });
}