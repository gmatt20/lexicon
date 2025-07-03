"use client";

import Navbar from "@/components/navbar";
import AuthForm from "@/components/forms/AuthForm";

export default function SignUpForm() {
  return (
    <div className="w-screen h-screen">
      <Navbar />
      <AuthForm method="sign-up" />
    </div>
  );
}
