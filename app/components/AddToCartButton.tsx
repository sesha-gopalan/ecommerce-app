"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "added">("idle");

  async function handleAddToCart() {
    setStatus("loading");

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    if (res.ok) {
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1500);
    } else {
      setStatus("idle");
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={status === "loading"}
      className="mt-6 bg-indigo-600 text-white rounded-full px-6 py-3 font-medium hover:bg-indigo-700 transition disabled:opacity-50"
    >
      {status === "added" ? "Added!" : status === "loading" ? "Adding..." : "Add to Cart"}
    </button>
  );
}