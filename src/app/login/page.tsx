'use client'

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createAccount, setCreateAccount] = useState(false);

  const [name, setName] = useState("");

  async function submitForm() {
    const supabase = createClient();

    if (createAccount) {
      const { data } = await supabase.auth.signUp({
        email: email,
        password: password
      });
      await supabase.from("students").insert({name: name, id: data.user?.id});
  
      router.push("/profile");
    } else {
      await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      router.push("/profile");
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold">Login</h1>
      <div className="flex flex-col">
        <div className="flex flex-col my-3">
          {createAccount ? (
            <>
              <label htmlFor="name" className="mx-2">Name:</label>
              <input type="text" name="name"
                onChange={(e) => setName(e.target.value)} value={name} placeholder="name..."
                className="border-purple-700 border-2 rounded-2xl p-3 flex-1"
              />
            </>) : null}
          <label htmlFor="email" className="mx-2">Email:</label>
          <input type="email" name="email"
            onChange={(e) => setEmail(e.target.value)} value={email} placeholder="email@placeholder.com"
            className="border-purple-700 border-2 rounded-2xl p-3 flex-1"
          />
        </div>
        <label htmlFor="password" className="mx-2">Password:</label>
        <input type="password" name="password"
          onChange={(e) => setPassword(e.target.value)} value={password} placeholder="password..."
          className="border-purple-700 border-2 rounded-2xl p-3 flex-1"
        />
        <label className="inline-flex items-center cursor-pointer my-4 ml-1">
          <input type="checkbox" className="sr-only peer" checked={createAccount} onChange={() => setCreateAccount(!createAccount)}/>
          <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-900 dark:peer-checked:bg-purple-900"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Create Account</span>
        </label>
        <button className="bg-purple-700 p-3 md:my-0 rounded-2xl text-lg" onClick={submitForm}>{createAccount ? "Create Account" : "Login"}</button>
      </div>
    </div>
  );
}