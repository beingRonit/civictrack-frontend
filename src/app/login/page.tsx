'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginApi } from '@/lib/api'
import { saveAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import ThemeToggle from '@/components/shared/ThemeToggle'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<'citizen' | 'admin'>('citizen')

  const { register: registerField, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    setLoading(true)
    try {
      const res = await loginApi(data.email, data.password)
      const userRole = res.data.user.role
      if (activeTab === 'citizen' && userRole !== 'citizen') {
        toast.error('This account is not a Citizen account. Please use the Admin tab.')
        return
      }
      if (activeTab === 'admin' && userRole !== 'admin') {
        toast.error('This account is not an Admin account. Please use the Citizen tab.')
        return
      }
      saveAuth(res.data.token, res.data.user)
      router.push('/dashboard')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy-dark to-navy-darker">
      <ThemeToggle />
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
              🖥 Admin
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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
          </div>

          <Button
            className="w-full bg-civic-orange hover:bg-[#EA580C] text-white font-bold text-base py-5 shadow-md transition-all hover:shadow-lg"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          {activeTab === 'citizen' && (
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-civic-blue hover:underline">
                Register here
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}