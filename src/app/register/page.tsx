'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerUserApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const { register: registerField, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterForm) {
    setLoading(true)
    try {
      await registerUserApi(data)
      setShowSuccess(true)
    } catch {
      toast.error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <Dialog open={showSuccess} onOpenChange={() => { setShowSuccess(false); router.push('/login') }}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Account Created Successfully!</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">Your account has been created. You can now log in with your credentials.</p>
        <DialogFooter className="sm:justify-center">
          <Button className="bg-navy hover:bg-navy-dark" onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy-dark to-navy-darker">
      <Card className="w-[420px] shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-civic-orange text-2xl">🏛</span>
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Join CivicTrack to submit and track complaints
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              {...registerField('name')}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...registerField('email')}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                {...registerField('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <Button
            className="w-full bg-navy hover:bg-navy-dark"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-civic-blue hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
    </>
  )
}
