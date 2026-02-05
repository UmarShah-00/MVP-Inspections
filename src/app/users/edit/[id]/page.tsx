"use client";

import UserEdit from "@/components/users/UserEdit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export default function EditUserPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/users/${params.id}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to fetch user");
                setUser(data.user);
            } catch (err: any) {
                Swal.fire({ title: "Error", text: err.message, icon: "error", background: "#fff", color: "#000", confirmButtonColor: "#000" });
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [params.id]);

    const handleUpdate = async (data: { name: string; email: string; password: string; confirmPassword: string; role: string }) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/users/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Failed to update user");

            Swal.fire({ title: "Success", text: "User updated successfully!", icon: "success", background: "#fff", color: "#000", confirmButtonColor: "#000" });
            router.push("/users");
        } catch (err: any) {
            Swal.fire({ title: "Error", text: err.message, icon: "error", background: "#fff", color: "#000", confirmButtonColor: "#000" });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center mt-10">Loading user...</p>;
    if (!user) return <p className="text-center mt-10">User not found</p>;

    return (
        <div>
            <h1 className="text-2xl font-semibold text-black mb-2">Edit User</h1>
            <p className="text-gray-500 mb-6">Update the details for this user.</p>
            <UserEdit
                initialData={{ name: user.name, email: user.email, password: "", confirmPassword: "", role: user.role }}
                onSave={handleUpdate}
            />
        </div>
    );
}
