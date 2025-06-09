"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Abstract from "@/public/milad-fakurian-E8Ufcyxz514-unsplash.webp";
import { useState } from "react";
import { SignUp } from "@/types/SignUp";
import { useHandleSignUpSubmit } from "@/lib/hooks/useHandleSignUpSubmit";

export default function SignUpForm() {
  const [formData, setFormData] = useState<SignUp>({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = useHandleSignUpSubmit(formData);

  return (
    <div
      className="w-screen h-screen"
      style={{ backgroundImage: `url(${Abstract.src})` }}>
      <div className="flex items-center justify-center flex-col h-full">
        <div className="min-w-[50%] max-w-[30%] shadow-lg flex items-center justify-center flex-col bg-white py-10 rounded-2xl">
          <div>
            <p className="text-4xl">Sign up</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center p-5">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  id="username"
                />
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
              <Button type="submit">Sign Up</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
