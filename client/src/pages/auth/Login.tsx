import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TrendingUp, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth, setLoading, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      setAuth(response.user, response.token);
      toast.success(`Welcome back, ${response.user.name}!`);
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = () => {
    setValue('email', 'demo@gigflow.com');
    setValue('password', 'password');
    toast.success('Credentials filled! Click Sign In.');
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="bg-glow-purple -top-40 -left-40" />
      <div className="bg-glow-cyan -bottom-45 -right-40" />

      {/* Main card box */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-xl shadow-brand-500/25 mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-wide m-0">
            Welcome to <span className="bg-gradient-to-r from-brand-400 to-indigo-300 bg-clip-text text-transparent">GigFlow</span>
          </h1>
          <p className="text-sm text-dark-400 mt-2 font-sans">
            Smart CRM Dashboard for modern freelancers & agencies
          </p>
        </div>

        {/* Card Form */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
                Corporate Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="email"
                  placeholder="e.g. alex@stripe.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-dark-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all text-sm mt-2"
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? 'Connecting...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Sandbox Login Section */}
          <div className="mt-6 pt-5 border-t border-white/5 flex flex-col gap-3">
            <button
              onClick={handleQuickLogin}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-brand-400 font-medium group transition-all"
            >
              <span>🚀 Sandbox Demo Mode (Auto-fill)</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-dark-400 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};
