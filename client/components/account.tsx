"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthentication } from "@/hooks/useAuthentication";
import { UpdateAccount } from "@/types/UpdateAccount";
import { useState } from "react";

export default function Account() {
  const { user, updateAccount } = useAuthentication();
  const [formData, setFormData] = useState<UpdateAccount>({
    email: "",
    username: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <p>Account configurations</p>
      <Label>Username</Label>
      <Input
        onChange={handleChange}
        name="username"
        value={formData.username}
        placeholder={user?.username}
      />
      <Label>Email</Label>
      <Input
        onChange={handleChange}
        name="email"
        value={formData.email}
        placeholder={user?.email}
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            Update Me
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>Just double checking.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="default"
                onClick={(e) => {
                  e.preventDefault();
                  updateAccount(formData);
                }}>
                Update Me
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
