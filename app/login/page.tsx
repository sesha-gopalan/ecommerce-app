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
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded p-2" required /> 
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded p-2" required /> {error && <p className="text-red-500 text-sm">{error}</p>} 
            <button type="submit" className="bg-black text-white rounded p-2 hover:bg-gray-800" > Log In </button> 
        </form> 
        </main> 
    ); 
}