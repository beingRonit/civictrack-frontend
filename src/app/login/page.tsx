'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '@/lib/api'
import { saveUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'citizen' | 'admin'>('citizen')

  const { register: registerField, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    setLoading(true)
    try {
      const res = await login(data.email, data.password)
      saveUser(res.data.user)
      router.push('/dashboard')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy-dark to-navy-darker">
      <Card className="w-[420px] shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-civic-orange text-2xl">🏛</span>
            <CardTitle className="text-2xl font-bold">CivicTrack</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Citizen Complaint Management System
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Role Tabs */}
          <div className="flex rounded-lg bg-muted p-1">
            <button
              onClick={() => setActiveTab('citizen')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'citizen' ? 'bg-background shadow-sm' : 'text-muted-foreground'
              }`}
            >
              👤 Citizen
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'admin' ? 'bg-background shadow-sm' : 'text-muted-foreground'
              }`}
            >
              🛡 Admin
            </button>
          </div>

          <div className="space-y-3">
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
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...registerField('password')}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
          </div>

          <Button
            className="w-full bg-navy hover:bg-navy-dark"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          {/* Demo Credentials Hint */}
          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Demo Credentials:</p>
            {activeTab === 'citizen' ? (
              <p>Email: test@example.com · Password: password123</p>
            ) : (
              <p>Email: admin@example.com · Password: admin123</p>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-civic-blue hover:underline">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}