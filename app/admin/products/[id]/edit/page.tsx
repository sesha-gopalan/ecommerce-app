"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProduct() {
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();
            setName(data.name);
            setDescription(data.description || "");
            setPrice(String(data.price));
            setStock(String(data.stock));
            setCategoryName(data.category?.name || "");
            setLoading(false);
        }
        loadProduct();
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/admin/products", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, name, description, price, stock, categoryName }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Something went wrong");
            return;
        }

        router.push("/admin");
        router.refresh();
    }

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const res = await fetch("/api/admin/products", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        if (res.ok) {
            router.push("/admin");
            router.refresh();
        }
    }

    if (loading) {
        return <main className="p-8 max-w-md mx-auto">Loading...</main>;
    }

    return (
        <main className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded p-2"
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="number"
                    placeholder="Price (₹)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border rounded p-2"
                    required
                />
                <input
                    type="number"
                    placeholder="Stock quantity"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="border rounded p-2"
                    required
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="border rounded p-2"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="bg-black text-white rounded p-2 hover:bg-gray-800"
                >
                    Save Changes
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="text-red-500 text-sm hover:underline"
                >
                    Delete Product
                </button>
            </form>
        </main>
    );
}