"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SignUpForAlertsForm() {
  function handleSubmit(e: any) {
    e.preventDefault();

    const email = e.target[0].value;

    if (email) {
      console.log(email);
      toast("You're Signed Up!", {
        description: "We'll let you know as soon as our service is live!",
      });

      e.target[0].value = "";
    } else {
      toast("Please enter a valid email address", {
        description: "We need your email to send you updates",
      });
    }
  }

  return (
    <div className="text-black mt-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm items-center space-x-2"
      >
        <Input type="email" placeholder="Email" />
        <Button type="submit" variant="secondary">
          Subscribe
        </Button>
      </form>
    </div>
  );
}
