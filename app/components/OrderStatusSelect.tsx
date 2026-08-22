"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrderStatusSelect({
    orderId,
    currentStatus,
}: {
    orderId: string;
    currentStatus: string;
}) {
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);
    const [saving, setSaving] = useState(false);

    async function handleChange(newStatus: string) {
        setStatus(newStatus);
        setSaving(true);

        await fetch(`/api/admin/orders`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, status: newStatus }),
        });

        setSaving(false);
        router.refresh();
    }

    return (
        <select
            value={status}
            onChange={(e) => handleChange(e.target.value)}
            disabled={saving}
            className="border rounded-lg p-2.5 bg-white"
        >
            {STATUSES.map((s) => (
                <option key={s} value={s}>
                    {s}
                </option>
            ))}
        </select>
    );
}