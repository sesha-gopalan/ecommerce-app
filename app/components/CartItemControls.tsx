"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartItemControls({
  itemId,
  quantity,
}: {
  itemId: string;
  quantity: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateQuantity(newQuantity: number) {
    if (newQuantity < 1) return;
    setLoading(true);
    await fetch(`/api/cart/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    });
    router.refresh();
    setLoading(false);
  }

  async function removeItem() {
    setLoading(true);
    await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => updateQuantity(quantity - 1)}
        disabled={loading}
        className="border rounded w-7 h-7"
      >
        -
      </button>
      <span>{quantity}</span>
      <button
        onClick={() => updateQuantity(quantity + 1)}
        disabled={loading}
        className="border rounded w-7 h-7"
      >
        +
      </button>
      <button
        onClick={removeItem}
        disabled={loading}
        className="text-sm text-red-500 ml-4"
      >
        Remove
      </button>
    </div>
  );
}