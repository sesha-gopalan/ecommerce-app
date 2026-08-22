"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setError("");
        const res = await signIn("credentials", { email, password, redirect: false, });
        if (res?.error) {
            setError("Invalid email or password");
            return;
        }
        router.push("/");
        router.refresh();
    }
    return (
        <main className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Log in</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded-lg p-2.5" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded-lg p-2.5" required /> {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="bg-indigo-600 text-white rounded-full p-2.5 font-medium hover:bg-indigo-700 transition" > Log In </button>
            </form>
        </main>
    );
}