"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SignUpForAlertsForm() {
  const [email, setEmail] = useState(""); // State to store the email value

  function handleSubmit(e: any) {
    e.preventDefault();

    // Function to submit user's email and client info to the backend.
    async function submitInfo() {
      try {
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        });

        if (response.ok) {
          console.log("Email submitted successfully");
          toast("You're Signed Up!", {
            description: "We'll let you know as soon as our service is live!",
          });
          setEmail("");
        } else {
          throw new Error("Failed to submit email");
        }
      } catch (error) {
        console.error("Failed to submit email", error);
        toast("Submission failed", {
          description: "Please try again later.",
        });
      }
    }

    if (email) {
      console.log(email);
      submitInfo();
    } else {
      toast("Please enter a valid email address", {
        description: "We need your email to send you updates",
      });
    }
  }

  // Handler to update the email state as the user types
  function handleEmailChange(e: any) {
    setEmail(e.target.value);
  }

  return (
    <div className="text-black mt-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm items-center space-x-2"
      >
        <Input
          className="bg-slate-950 text-white"
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange} // Set the onChange handler to update the state
        />
        <Button
          type="submit"
          className="bg-slate-950 hover:bg-slate-800 active:bg-black"
        >
          Subscribe
        </Button>
      </form>
    </div>
  );
}
