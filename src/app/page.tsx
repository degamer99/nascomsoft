"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function AuthPage() {
  const router = useRouter()
  const { user, loading: authLoading, signIn, signUp, signInWithGoogle } =
    useUserStore()

  // local form state
  const [form, setForm] = useState({ email: "", password: "" })
  const [isNewUser, setIsNewUser] = useState(false)
  const [loading, setLoading] = useState(false)        // form-submit loading
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)


  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        console.log('✅ SW Ready:', reg);
      }).catch((err) => {
        console.error('❌ SW error:', err);
      });
    } else {
      console.log('🚫 Service workers not supported');
    }
  }, []);


  // // redirect after login
  // useEffect(() => {
  //   if (!authLoading && user) {
  //     router.push("/home")
  //   }
  // }, [user, authLoading, router])

  // simple field validation
  const validate = () => {
    if (!form.email.includes("@")) {
      setError("Please enter a valid email address.")
      return false
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return false
    }
    return true
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validate()) return

    setLoading(true)
    try {
      if (isNewUser) {
        await signUp(form.email, form.password)
      } else {
        await signIn(form.email, form.password)
      }
      // onAuthStateChanged will redirect
    } catch (err: unknown) {
      let msg = "Unexpected error. Please try again."
      if (err instanceof Error) {
        // map common Firebase errors
        if (err.message.includes("auth/wrong-password")) {
          msg = "Incorrect password."
        } else if (err.message.includes("auth/user-not-found")) {
          msg = "No account found with that email."
        } else if (err.message.includes("auth/email-already-in-use")) {
          msg = "That email is already in use."
        } else {
          msg = err.message
        }
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 px-6 bg-white mb-4">
      <Image
        src="/nascomsoft_logo.jpeg"
        alt="Logo"
        width={300}
        height={300}
      />
      <h1 className="text-3xl font-extrabold text-gray-600">Nascomsoft</h1>
      <h2 className="text-teal-600 font-bold text-2xl mb-8">E-Store</h2>

      {/* Error alert */}
      {error && (
        <Alert className="w-full max-w-md mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-6"
        noValidate
      >
        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Email"
            className="pl-10 py-6"
            value={form.email}
            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          {showPassword ? (
            <EyeOff
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <Eye
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="pl-10 pr-10 py-6"
            value={form.password}
            onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
            required
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full flex items-center justify-center py-6 bg-teal-600 text-white"
          disabled={loading || authLoading}
        >
          {loading || authLoading ? (
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
          ) : null}
          {isNewUser ? "Create Account" : "Sign In"}
        </Button>

        {/* Google */}
        <Button
          variant="outline"
          type="button"
          className="w-full py-6 text-teal-700"
          onClick={async () => {
            setError(null)
            setLoading(true)
            try {
              await signInWithGoogle()
            } catch {
              setError("Google sign-in failed.")
            } finally {
              setLoading(false)
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          Continue with Google
        </Button>

        {/* Toggle */}
        <p className="text-center text-sm text-gray-600 mb-2">
          {isNewUser ? "Already have an account?" : "Don’t have an account yet?"}{" "}
          <button
            type="button"
            className="text-teal-600 underline"
            onClick={() => {
              setIsNewUser(v => !v)
              setError(null)
            }}
          >
            {isNewUser ? "Sign In" : "Sign Up"}
          </button>
        </p>

        {/* Skip */}
        <p className="text-center text-sm text-gray-600">
          Want to explore without signing in?{" "}
          <a href="/home" className="text-teal-600 underline">
            Continue as Guest
          </a>
        </p>
      </form>
    </div>
  )
}
