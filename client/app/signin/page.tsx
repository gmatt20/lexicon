"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Abstract from "@/public/milad-fakurian-E8Ufcyxz514-unsplash.webp";
import { useState } from "react";
import { SignIn } from "@/types/SignIn";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignInForm() {
  const router = useRouter();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = "http://localhost:8000/auth/sign-in/";

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        toast("Signin failed, please try again later.", {
          action: {
            label: "Go Home",
            onClick: () => router.push("/"),
          },
        });
        console.error("Signin failed: ", error);
      } else {
        toast(`Welcome ${formData.email}!`);
        const result = await response.json();
        console.log("Signin successful", result);
        router.push("/chat");
      }
    } catch (error) {
      toast("Signin failed on the server side, please try again later.", {
        action: {
          label: "Go Home",
          onClick: () => router.push("/"),
        },
      });
      console.error(error);
    }
  };

  return (
    <div
      className="w-screen h-screen"
      style={{ backgroundImage: `url(${Abstract.src})` }}>
      <div className="flex items-center justify-center flex-col h-full">
        <div className="min-w-[50%] max-w-[30%] shadow-lg flex items-center justify-center flex-col bg-white py-10 rounded-2xl">
          <div>
            <p className="text-4xl">Sign in</p>
          </div>
          <form onSubmit={handleSubmit}>
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
