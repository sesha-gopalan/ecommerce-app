"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load payment gateway. Check your internet connection.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    const options = {
      key: data.keyId,
      amount: data.amount,
      currency: "INR",
      name: "MyStore",
      description: "Order Payment",
      order_id: data.razorpayOrderId,
      handler: async function (response: any) {
        const verifyRes = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });

        const verifyData = await verifyRes.json();

        if (verifyRes.ok) {
          router.push(`/orders/${verifyData.orderId}`);
        } else {
          alert("Payment verification failed");
        }
      },
      theme: { color: "#000000" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    setLoading(false);
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-indigo-600 text-white rounded-full px-6 py-3 font-medium hover:bg-indigo-700 transition disabled:opacity-50 w-full mt-4"
    >
      {loading ? "Loading..." : "Proceed to Checkout"}
    </button>
  );
}