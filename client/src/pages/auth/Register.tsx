import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TrendingUp, User as UserIcon, Mail, Lock, UserPlus } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'SALES']),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth, setLoading, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'SALES',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const response = await authService.register(data);
      setAuth(response.user, response.token);
      toast.success(`Account created! Welcome, ${response.user.name}!`);
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="bg-glow-purple -top-40 -left-40" />
      <div className="bg-glow-cyan -bottom-45 -right-40" />

      {/* Main container */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo and Head */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-xl shadow-brand-500/25 mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-wide m-0">
            Create an Account
          </h1>
          <p className="text-sm text-dark-400 mt-2 font-sans">
            Start managing your high-value sales pipelines with ease
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-400 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="email"
                  placeholder="alex@agency.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                Role
              </label>
              <select
                className="w-full pl-4 pr-4 py-3 rounded-xl glass-input text-sm appearance-none"
                {...register('role')}
              >
                <option value="SALES" className="bg-dark-900 text-white">Sales</option>
                <option value="ADMIN" className="bg-dark-900 text-white">Admin</option>
              </select>
              {errors.role && (
                <p className="text-xs text-rose-400 mt-1">{errors.role.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all text-sm mt-2"
            >
              <UserPlus className="w-4 h-4" />
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-dark-400 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
