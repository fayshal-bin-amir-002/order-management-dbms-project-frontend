"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, ...props }, ref) => {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        className={className}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setShow(!show)}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        {show ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </Button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";
