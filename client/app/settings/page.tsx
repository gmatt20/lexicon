"use client";

import { useAuthentication } from "@/hooks/useAuthentication";

export default function Settings() {
  const { user } = useAuthentication();

  return (
    <>
      <p>{user?.username}</p>
    </>
  );
}
