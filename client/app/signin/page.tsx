"use client";

import Navbar from "@/components/navbar";
import AuthForm from "@/components/Forms/AuthForm";

export default function SignInPage() {
  return (
    <div className="w-screen h-screen">
      <Navbar />
      <AuthForm method="sign-in" />
    </div>
  );
}
