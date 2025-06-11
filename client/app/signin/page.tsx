"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Abstract from "@/public/milad-fakurian-E8Ufcyxz514-unsplash.webp";
import { useState } from "react";
import { SignIn } from "@/types/SignIn";
import { useAuthentication } from "@/hooks/useAuthentication";

export default function SignInForm() {
  const [formData, setFormData] = useState<SignIn>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const { signIn } = useAuthentication();

  return (
    <div
      className="w-screen h-screen"
      style={{ backgroundImage: `url(${Abstract.src})` }}>
      <div className="flex items-center justify-center flex-col h-full">
        <div className="min-w-[50%] max-w-[30%] shadow-lg flex items-center justify-center flex-col bg-white py-10 rounded-2xl">
          <div>
            <p className="text-4xl">Sign in</p>
          </div>
          <form onSubmit={(e) => signIn(formData)(e)}>
            <div className="flex flex-col items-center justify-center p-5">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  id="email"
                />
                <Label htmlFor="password">Password</Label>
                <Input
                  required
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  id="password"
                />
              </div>
              <Button type="submit">Sign In</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
