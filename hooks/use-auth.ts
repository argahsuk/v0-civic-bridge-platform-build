"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";

interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: "resident" | "official";
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useAuth() {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR<{ user: AuthUser | null }>(
    "/api/auth/session",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await mutate({ user: null }, false);
    router.push("/");
  };

  return {
    user: data?.user ?? null,
    isLoading: isLoading || (!data && !error),
    logout,
    mutate,
  };
}
