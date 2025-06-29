"use client";

import Abstract from "@/public/milad-fakurian-E8Ufcyxz514-unsplash.webp";
import AuthForm from "@/components/Forms/AuthForm";

export default function SignUpForm() {
  return (
    <div
      className="w-screen h-screen"
      style={{ backgroundImage: `url(${Abstract.src})` }}>
      <AuthForm method="sign-up" />
    </div>
  );
}
