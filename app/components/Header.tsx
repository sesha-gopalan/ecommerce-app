"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
export default function Header() {
    const { data: session } = useSession();
    return (
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
                <Link href="/" className="font-bold text-xl tracking-tight text-indigo-600">
                    MyStore
                </Link>
                <div className="flex items-center gap-6">
                    {session?.user ? (
                        <>
                            <Link href="/cart" className="text-sm text-gray-600 hover:text-indigo-600 transition">
                                Cart
                            </Link>
                            <Link href="/orders" className="text-sm text-gray-600 hover:text-indigo-600 transition">
                                Orders
                            </Link>
                            {session.user.role === "ADMIN" && (
                                <Link href="/admin" className="text-sm font-semibold text-indigo-600">
                                    Admin
                                </Link>
                            )}
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center">
                                    {session.user.email?.[0]?.toUpperCase()}
                                </div>
                                <span className="text-sm text-gray-500 hidden sm:inline">
                                    {session.user.email?.split("@")[0]}
                                </span>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="text-sm bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm text-gray-600 hover:text-indigo-600 transition">
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-full hover:bg-indigo-700 transition"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}