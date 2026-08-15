"use client"; 
import { useState } from "react"; 
import { useRouter } from "next/navigation"; 
export default function SignupPage() { 
    const router = useRouter(); 
    const [name, setName] = useState(""); 
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [error, setError] = useState(""); 
    async function handleSubmit(e: React.FormEvent) { 
        e.preventDefault(); setError(""); 
        const res = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }), }); 
        if (!res.ok) { 
            const data = await res.json(); 
            setError(data.error || "Something went wrong"); 
            return; 
        } 
        router.push("/login"); 
    } 
    return ( 
    <main className="p-8 max-w-md mx-auto"> 
    <h1 className="text-2xl font-bold mb-6">Create an account</h1> 
    <form onSubmit={handleSubmit} className="flex flex-col gap-4"> 
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border rounded p-2" /> 
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded p-2" required /> 
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded p-2" required /> {error && <p className="text-red-500 text-sm">{error}</p>} 
        <button type="submit" className="bg-black text-white rounded p-2 hover:bg-gray-800" > Sign Up </button> 
        </form> 
        </main> 
    ); 
}