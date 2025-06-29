import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthInputProps = {
  label: string;
  type: "email" | "text" | "password";
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const AuthInput = ({ label, type, value, name, onChange }: AuthInputProps) => {
  return (
    <>
      <Label htmlFor={label}>{label}</Label>
      <Input
        className="mb-5"
        required
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

export default AuthInput;
