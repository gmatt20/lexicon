import { useAuthentication } from "@/hooks/useAuthentication";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthInput from "@/components/AuthInput";
import { AuthMethod } from "@/types/AuthMethod";

interface AuthFormProps {
  method: AuthMethod;
}

const AuthForm = ({ method }: AuthFormProps) => {
  const { signIn, signUp } = useAuthentication();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex items-center justify-center flex-col h-full">
      <div className="min-w-[50%] max-w-[30%] shadow-lg flex items-center justify-center flex-col bg-white py-10 rounded-2xl">
        <div>
          <p className="text-4xl">
            {method === "sign-in" ? "Sign in" : "Sign up"}
          </p>
        </div>
        <form
          onSubmit={(e) =>
            method === "sign-in" ? signIn(formData)(e) : signUp(formData)(e)
          }
        >
          <div className="flex flex-col items-center justify-center p-5">
            <div>
              {method === "sign-up" && (
                <>
                  <AuthInput
                    label="Username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </>
              )}
              <AuthInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <AuthInput
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button type="submit">
              {method === "sign-in" ? "Sign In" : "Sign Up"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
