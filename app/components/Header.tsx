"use client"; 
import { useSession, signOut } from "next-auth/react"; 
import Link from "next/link"; 
export default function Header() { 
    const { data: session } = useSession(); 
    return ( 
        <header className="flex justify-between items-center p-4 border-b"> 
        <Link href="/" className="font-bold text-lg"> MyStore </Link> 
        <div className="flex items-center gap-4"> {
            session?.user ? ( 
                <> 
                <span className="text-sm text-gray-600"> Logged in as {session.user.email} </span> 
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200" > Log out </button> </> 
            ) : ( 
                    <> 
                    <Link href="/login" className="text-sm"> Log in </Link> 
                    <Link href="/signup" className="text-sm"> Sign up </Link> 
                    </> 
                )
        } 
        </div> 
        </header> 
    ); 
}