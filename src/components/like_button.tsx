'use client'

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LikeButton({ eventId }: { eventId: number }) {
  const supabase = createClient();
  const [liked, setLiked] = useState(false);

  const loadLikes = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (userData.user != null) {
      const { data } = await supabase.from("students").select("favourites").eq("id", userData.user?.id).single();
  
      if (data?.favourites.includes(eventId)) {
        setLiked(true);
      }
    }
  }
  useEffect(() => {
    loadLikes();
  })

  async function handleLike(event: React.MouseEvent) {
    event.stopPropagation();
    const { data: userData } = await supabase.auth.getUser();

    if (userData.user != null) {
      const { data } = await supabase.from("students").select("favourites").eq("id", userData.user?.id).single();
      
      let newFavourites = [];
      if (liked) {
        newFavourites = data?.favourites.filter((id: number) => id != eventId);
      } else {
        newFavourites = [...data?.favourites, eventId];
      }
      setLiked(!liked)
      await supabase.from("students").update({favourites: newFavourites}).eq("id", userData.user?.id);
    }
  }

  return (
    <div onClick={handleLike}>
      <Image src={liked ? "/favourite_coloured.svg" : "/favourite.svg"} width={30} height={30} alt="tag icon" className="mr-1"/>
    </div>
  );
}