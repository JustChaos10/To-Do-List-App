"use client";
import { createBrowserClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthPage() {
  const supabase = createBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="text-xl font-semibold mb-4">{isSignUp ? "Sign up" : "Sign in"}</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <label className="block text-sm">Email</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="block text-sm">Password</label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2 pt-2">
          <Button type="submit">{isSignUp ? "Create account" : "Sign in"}</Button>
          <Button type="button" variant="secondary" onClick={() => setIsSignUp((v) => !v)}>
            {isSignUp ? "Have an account? Sign in" : "New here? Sign up"}
          </Button>
        </div>
      </form>
    </div>
  );
}


