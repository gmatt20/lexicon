import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <div className="flex items-center justify-center flex-col  shadow-lg w-1/2">
        <div>
          <p className="text-4xl">Sign up</p>
        </div>
        <form method="post">
          <div className="flex items-center justify-center flex-col">
            <Input type="text" name="username" id="username" />
            <label>Username</label>
            <Input type="email" name="email" id="email" />
            <label>Email</label>
            <Input type="password" name="password" id="password" />
            <label>Password</label>
            <Button>Sign Up</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
