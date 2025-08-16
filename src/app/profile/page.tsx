'use client'

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Favourites() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<any>();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user == null) {
        router.push("/login")
      } else {
        const { data: userData } = await supabase.from("students").select("*").eq("id", data.user.id).single();
        setUser(userData);
      }
    }

    loadUser();
  })

  return (
    <div>
      <h1 className="text-4xl font-bold">Profile</h1>
      {user?.name}
    </div>
  );
}