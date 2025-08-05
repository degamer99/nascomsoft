// src/app/page.tsx (formerly `Index`)
"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import { useUserStore } from "@/store/userStore"

export default function Index() {
  // **Local state** for your two inputs
  const [form, setForm] = useState({ email: "", password: "" })
  // **Toggle** between "sign in" and "sign up"
  const [isNewUser, setIsNewUser] = useState(false)

  // **Pull** your auth actions & status from the Zustand store
  const { signIn, signUp, loading, user } = useUserStore()

  // Update email/password fields
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.id]: e.target.value }))
  }

  // When the form submits…
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isNewUser) {
        await signUp(form.email, form.password)
      } else {
        await signIn(form.email, form.password)
      }
      // at this point, `onAuthStateChanged` in your store will fire
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 px-6 bg-white">
      {/* …your logo/title… */}

      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-6 mb-16"
      >
        {/* Email & Password fields */}
        {["email", "password"].map((field) => (
          <div className="relative" key={field}>
            <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
              <Mail className="h-5 w-5" />
            </span>
            <Input
              id={field}
              type={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="pl-10 py-6"
              required
              value={form[field as "email" | "password"]}
              onChange={onChange}
            />
          </div>
        ))}

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full bg-teal-600 py-6 font-bold text-xl hover:bg-teal-700 text-white"
          disabled={loading}
        >
          {loading
            ? "Please wait…"
            : isNewUser
            ? "Create Account"
            : "Sign In"}
        </Button>

        {/* Toggle link */}
        <p className="text-center text-sm text-gray-600">
          {isNewUser
            ? "Already have an account?"
            : "Don’t have an account yet?"}{" "}
          <button
            type="button"
            className="text-teal-600 underline"
            onClick={() => setIsNewUser((v) => !v)}
          >
            {isNewUser ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  )
}
