import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Abstract from "@/public/milad-fakurian-E8Ufcyxz514-unsplash.webp";

export default function SignUp() {
  return (
    <div
      className="w-screen h-screen"
      style={{ backgroundImage: `url(${Abstract.src})` }}>
      <div className="flex items-center justify-center flex-col h-full">
        <div className="min-w-[50%] max-w-[30%] shadow-lg flex items-center justify-center flex-col bg-white py-10 rounded-2xl">
          <div>
            <p className="text-4xl">Sign in</p>
          </div>
          <form method="post">
            <div className="flex flex-col items-center justify-center p-5">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" name="email" id="email" />
                <Label htmlFor="password">Password</Label>
                <Input type="password" name="password" id="password" />
              </div>
              <Button>Sign Up</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
