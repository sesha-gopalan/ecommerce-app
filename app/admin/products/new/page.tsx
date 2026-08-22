"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [error, setError] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [specs, setSpecs] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description, price, stock, categoryName, imageUrl, specs }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Something went wrong");
            return;
        }

        router.push("/admin");
        router.refresh();
    }

    return (
        <main className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add Product</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded-lg p-2.5"
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border rounded-lg p-2.5"
                />
                <input
                    type="number"
                    placeholder="Price (₹)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border rounded-lg p-2.5"
                    required
                />
                <input
                    type="number"
                    placeholder="Stock quantity"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="border rounded-lg p-2.5"
                    required
                />
                <input
                    type="text"
                    placeholder="Category (e.g. Electronics)"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="border rounded-lg p-2.5"
                />
                <input
                    type="text"
                    placeholder="Image URL (optional)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="border rounded-lg p-2.5"
                />
                <input
                    type="text"
                    placeholder="Specs, comma-separated (e.g. Intel Core i5, 16GB RAM, 512GB SSD)"
                    value={specs}
                    onChange={(e) => setSpecs(e.target.value)}
                    className="border rounded-lg p-2.5"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="bg-indigo-600 text-white rounded-full p-2.5 font-medium hover:bg-indigo-700 transition"
                >
                    Create Product
                </button>
            </form>
        </main>
    );
}