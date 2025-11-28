'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';

const registerSchema = z
  .object({
    companyName: z.string().min(1, 'Company name is required'),
    email: z.string().email('Invalid email address'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.auth.register(data);
      setAuth(response.user, response.accessToken, response.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </a>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Company Name */}
            <Input
              {...register('companyName')}
              id="companyName"
              label="Company Name"
              type="text"
              placeholder="Acme Inc"
              error={!!errors.companyName}
              helperText={errors.companyName?.message}
              fullWidth
            />

            {/* Email */}
            <Input
              {...register('email')}
              id="email"
              label="Email Address"
              type="email"
              autoComplete="email"
              placeholder="john@example.com"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />

            {/* First and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                {...register('firstName')}
                id="firstName"
                label="First Name"
                type="text"
                placeholder="John"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                fullWidth
              />

              <Input
                {...register('lastName')}
                id="lastName"
                label="Last Name"
                type="text"
                placeholder="Doe"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                fullWidth
              />
            </div>

            {/* Password with show/hide toggle */}
            <Input
              {...register('password')}
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
            />

            {/* Confirm Password with show/hide toggle */}
            <Input
              {...register('confirmPassword')}
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              fullWidth
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

