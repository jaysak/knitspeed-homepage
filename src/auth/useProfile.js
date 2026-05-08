import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthProvider";

export function useProfile() {
  const { session } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!session?.user?.id) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id,email,full_name,role")
        .eq("id", session.user.id)
        .single();

      if (error) console.error("Profile load error:", error.message);

      setProfile(data);
      setProfileLoading(false);
    }

    loadProfile();
  }, [session?.user?.id]);

  return { profile, profileLoading };
}
