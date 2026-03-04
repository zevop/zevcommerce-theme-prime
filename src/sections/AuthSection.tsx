'use client'

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  useTheme, useCustomerAuth, getStorePermalink,
  login as apiLogin,
  register as apiRegister,
  forgotPassword as apiForgotPassword,
  verifyOtp as apiVerifyOtp,
  resetPassword as apiResetPassword,
} from '@zevcommerce/storefront-api';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

// --- Shared Types ---
interface AuthBlockProps {
  settings: any;
  state?: any;
  onSuccess?: (data?: any) => void;
}

// Auth Form Block - Login
function LoginFormBlock({ settings }: AuthBlockProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const domain = params?.domain as string;
  const { theme } = useTheme();
  const { login } = useCustomerAuth();
  const store = theme?.storeConfig;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;

    setLoading(true);
    try {
      const res = await apiLogin(domain, store.id, { email, password });
      login(res.access_token, res.customer);
      toast.success('Welcome back!');
      router.push(getStorePermalink(domain, '/account'));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5 ml-1 opacity-70">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="w-full px-4 py-3 border rounded-lg outline-none transition text-sm"
          required
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5 ml-1">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          {settings.show_forgot_password && (
            <Link href={getStorePermalink(domain, '/account/forgot-password')} className="text-xs font-medium hover:underline transition-all" style={{ color: 'var(--color-link)' }}>
              Forgot password?
            </Link>
          )}
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border rounded-lg outline-none transition text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 p-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-lg font-semibold text-white transition disabled:opacity-50 active:scale-[0.98] mt-2 shadow-sm"
        style={{ backgroundColor: settings.button_color || 'var(--color-primary)' }}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
          <>
            {settings.button_text || 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {settings.show_register_link && store?.accountConfig?.registrationEnabled !== false && (
        <p className="text-center text-sm opacity-60 pt-2">
          Don't have an account?{' '}
          <Link href={getStorePermalink(domain, '/register')} className="font-bold hover:underline transition-all underline-offset-4" style={{ color: 'var(--color-link)' }}>
            Create account
          </Link>
        </p>
      )}
    </form>
  );
}

// Auth Form Block - Register
function RegisterFormBlock({ settings }: AuthBlockProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const domain = params?.domain as string;
  const { theme } = useTheme();
  const { login } = useCustomerAuth();
  const store = theme?.storeConfig;
  const requiredFields = store?.accountConfig?.requiredFields || ['email'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;

    setLoading(true);
    try {
      const res = await apiRegister(domain, store.id, formData);
      login(res.access_token, res.customer);
      toast.success('Account created successfully!');
      router.push(getStorePermalink(domain, '/account'));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 ml-1 opacity-70">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="John"
            className="w-full px-4 py-3 border rounded-lg outline-none transition text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 ml-1 opacity-70">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Doe"
            className="w-full px-4 py-3 border rounded-lg outline-none transition text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 ml-1 opacity-70">Email Address</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="name@example.com"
          className="w-full px-4 py-3 border rounded-lg outline-none transition text-sm"
          required
        />
      </div>

      {requiredFields.includes('phone') && (
        <div>
          <label className="block text-sm font-medium mb-1.5 ml-1 opacity-70">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+234..."
            className="w-full px-4 py-3 border rounded-lg outline-none transition text-sm"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5 ml-1 opacity-70">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Min. 8 characters"
            className="w-full px-4 py-3 border rounded-lg outline-none transition text-sm"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 p-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {settings.show_terms && (
        <label className="flex items-start gap-3 p-1 cursor-pointer group">
          <input type="checkbox" required className="mt-1 w-4 h-4 rounded" style={{ borderColor: 'var(--color-border)', accentColor: 'var(--color-primary)' }} />
          <span className="text-[13px] opacity-60 leading-tight">
            I agree to the{' '}
            <Link href={getStorePermalink(domain, '/pages/terms')} className="font-medium hover:underline" style={{ color: 'var(--color-link)' }}>Terms of Service</Link>
            {' '}and{' '}
            <Link href={getStorePermalink(domain, '/pages/privacy')} className="font-medium hover:underline" style={{ color: 'var(--color-link)' }}>Privacy Policy</Link>
          </span>
        </label>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-lg font-semibold text-white transition disabled:opacity-50 active:scale-[0.98] mt-2 shadow-sm"
        style={{ backgroundColor: settings.button_color || 'var(--color-primary)' }}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
          <>
            {settings.button_text || 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {settings.show_login_link && (
        <p className="text-center text-sm opacity-60 pt-2">
          Already have an account?{' '}
          <Link href={getStorePermalink(domain, '/login')} className="font-bold hover:underline transition-all underline-offset-4" style={{ color: 'var(--color-link)' }}>
            Sign in
          </Link>
        </p>
      )}
    </form>
  );
}

// --- Forgot Password Blocks ---

function ForgotPasswordFormBlock({ settings, onSuccess }: AuthBlockProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const domain = params?.domain as string;
  const { theme } = useTheme();
  const store = theme?.storeConfig;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;

    setLoading(true);
    try {
      await apiForgotPassword(domain, store.id, { email });
      toast.success('Verification code sent to your email');
      onSuccess?.(email);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5 ml-1 opacity-70">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="w-full px-4 py-3 border rounded-lg outline-none transition text-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-lg font-semibold text-white transition disabled:opacity-50 active:scale-[0.98] mt-2 shadow-sm"
        style={{ backgroundColor: settings.button_color || 'var(--color-primary)' }}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
          <>
            {settings.button_text || 'Send Reset Code'}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="text-center pt-2">
        <Link href={getStorePermalink(domain, '/login')} className="text-sm font-medium hover:underline transition-all underline-offset-4" style={{ color: 'var(--color-link)' }}>
          Back to Login
        </Link>
      </div>
    </form>
  );
}

function OtpVerificationFormBlock({ settings, state, onSuccess }: AuthBlockProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const domain = params?.domain as string;
  const { theme } = useTheme();
  const store = theme?.storeConfig;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store || !state?.email) return;

    setLoading(true);
    try {
      await apiVerifyOtp(domain, store.id, { email: state.email, code });
      toast.success('Code verified successfully!');
      onSuccess?.(code);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-sm opacity-60" style={{ color: 'var(--color-text)' }}>We've sent a 6-digit code to <span className="font-semibold opacity-100" style={{ color: 'var(--color-heading)' }}>{state?.email}</span></p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 ml-1 opacity-70 text-center font-mono tracking-widest uppercase">Enter 6-digit Code</label>
        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="000 000"
          className="w-full px-4 py-3 border rounded-lg outline-none transition text-center text-2xl font-bold tracking-[0.5em] font-mono"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-heading)' }}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-lg font-semibold text-white transition disabled:opacity-50 active:scale-[0.98] mt-2 shadow-sm"
        style={{ backgroundColor: settings.button_color || 'var(--color-primary)' }}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
          <>
            {settings.button_text || 'Verify Code'}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-sm font-medium hover:underline transition-all underline-offset-4" style={{ color: 'var(--color-link)' }}
        >
          Resend Code
        </button>
      </div>
    </form>
  );
}

function ResetPasswordFormBlock({ settings, state }: AuthBlockProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const domain = params?.domain as string;
  const { theme } = useTheme();
  const store = theme?.storeConfig;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store || !state?.email || !state?.code) return;

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await apiResetPassword(domain, store.id, {
        email: state.email,
        code: state.code,
        newPassword
      });
      toast.success('Password reset successful! Please sign in.');
      router.push(getStorePermalink(domain, '/login'));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5 ml-1 opacity-70">New Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min. 8 characters"
            className="w-full px-4 py-3 border rounded-lg outline-none transition text-sm"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 p-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 ml-1 opacity-70">Confirm New Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat password"
          className="w-full px-4 py-3 border rounded-lg outline-none transition text-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-lg font-semibold text-white transition disabled:opacity-50 active:scale-[0.98] mt-2 shadow-sm"
        style={{ backgroundColor: settings.button_color || 'var(--color-primary)' }}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
          <>
            {settings.button_text || 'Reset Password'}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

// Auth Header Block
function AuthHeaderBlock({ settings }: { settings: any }) {
  const { theme } = useTheme();
  const store = theme?.storeConfig;

  return (
    <div className="text-center mb-8">
      {settings.show_logo && (
        <div className="mb-6 flex justify-center">
          {store?.storeLogo ? (
            <img src={store.storeLogo} alt={store.name} className="h-10 object-contain" />
          ) : (
            <div className="h-12 w-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
              {store?.name?.[0] || 'S'}
            </div>
          )}
        </div>
      )}
      <h1 className="text-2xl font-bold tracking-tight" style={{ color: settings.title_color || 'var(--color-heading)', fontFamily: 'var(--font-heading)' }}>
        {settings.title || 'Welcome'}
      </h1>
      {settings.subtitle && (
        <p className="mt-2 text-sm opacity-60" style={{ color: 'var(--color-text)' }}>{settings.subtitle}</p>
      )}
    </div>
  );
}

// Social Auth Block
function SocialAuthBlock({ settings }: { settings: any }) {
  return (
    <div className="space-y-4 pt-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: 'var(--color-border)' }} />
        </div>
        <div className="relative flex justify-center text-[12px] uppercase tracking-wider font-semibold">
          <span className="px-3 opacity-40" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {settings.show_google && (
          <button className="flex items-center justify-center gap-2 py-2.5 px-4 border rounded-lg hover:opacity-70 transition text-sm font-medium">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
        )}
        {settings.show_apple && (
          <button className="flex items-center justify-center gap-2 py-2.5 px-4 border rounded-lg hover:opacity-70 transition text-sm font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Apple
          </button>
        )}
      </div>
    </div>
  );
}

// Block Registry
const AUTH_BLOCKS: Record<string, React.FC<AuthBlockProps>> = {
  auth_header: AuthHeaderBlock as any,
  login_form: LoginFormBlock,
  register_form: RegisterFormBlock,
  social_auth: SocialAuthBlock as any,
  forgot_password_form: ForgotPasswordFormBlock,
  otp_verification_form: OtpVerificationFormBlock,
  reset_password_form: ResetPasswordFormBlock,
};

// Main Auth Section
export default function AuthSection({ settings, blocks }: { settings: any; blocks?: any[] }) {
  const mode = settings.mode || 'login';
  const { theme } = useTheme();
  const contextSettings = theme?.storeConfig?.accountConfig;

  // Local state for multi-step flows
  const [currentStep, setCurrentStep] = useState<'initial' | 'otp' | 'reset'>('initial');
  const [flowState, setFlowState] = useState<any>({});

  const defaultLoginBlocks = [
    { type: 'auth_header', settings: { title: 'Welcome back', subtitle: 'Sign in to your account', show_logo: true } },
    { type: 'login_form', settings: { show_forgot_password: true, show_register_link: true, button_text: 'Sign In' } },
    { type: 'social_auth', settings: { show_google: true, show_apple: true } },
  ];

  const defaultRegisterBlocks = [
    { type: 'auth_header', settings: { title: 'Create account', subtitle: 'Join us today', show_logo: true } },
    { type: 'register_form', settings: { show_terms: true, show_login_link: true, button_text: 'Create Account' } },
    { type: 'social_auth', settings: { show_google: true, show_apple: true } },
  ];

  const defaultForgotPasswordBlocks = [
    { type: 'auth_header', settings: { title: 'Forgot Password', subtitle: 'Enter your email to receive a code', show_logo: true } },
    { type: 'forgot_password_form', settings: { button_text: 'Send Reset Code' } },
  ];

  const defaultOtpVerificationBlocks = [
    { type: 'auth_header', settings: { title: 'Verify Code', subtitle: 'Enter the code sent to your email', show_logo: true } },
    { type: 'otp_verification_form', settings: { button_text: 'Verify Code' } },
  ];

  const defaultResetPasswordBlocks = [
    { type: 'auth_header', settings: { title: 'Reset Password', subtitle: 'Enter your new password below', show_logo: true } },
    { type: 'reset_password_form', settings: { button_text: 'Reset Password' } },
  ];

  let initialBlocks: any[] = mode === 'register' ? defaultRegisterBlocks : defaultLoginBlocks;
  if (mode === 'forgot-password') initialBlocks = defaultForgotPasswordBlocks;

  const activeBlocks = blocks && blocks.length > 0 ? blocks : initialBlocks;

  // Override blocks based on step if in forgot-password mode
  let functionalBlocks = activeBlocks;
  if (mode === 'forgot-password') {
    if (currentStep === 'otp') functionalBlocks = defaultOtpVerificationBlocks;
    if (currentStep === 'reset') functionalBlocks = defaultResetPasswordBlocks;
  }

  return (
    <section className="min-h-[85vh] flex items-center justify-center py-12 px-4" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="w-full max-w-[440px] mx-auto">
        <div className="rounded-[24px] shadow-xl border p-8 md:p-10" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
          {!contextSettings?.loginEnabled && mode === 'login' ? (
            <div className="text-center py-8">
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-heading)' }}>Login Disabled</h2>
              <p className="opacity-60" style={{ color: 'var(--color-text)' }}>Customer login is currently disabled for this store.</p>
            </div>
          ) : (mode === 'register' && contextSettings?.registrationEnabled === false) ? (
            <div className="text-center py-8">
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-heading)' }}>Registration Closed</h2>
              <p className="opacity-60" style={{ color: 'var(--color-text)' }}>New account registration is currently disabled.</p>
            </div>
          ) : (
            functionalBlocks.map((block, idx) => {
              const BlockComponent = AUTH_BLOCKS[block.type];
              if (!BlockComponent) return null;

              // Handle succession in multi-step flow
              const handleSuccess = (data: any) => {
                if (block.type === 'forgot_password_form') {
                  setFlowState({ ...flowState, email: data });
                  setCurrentStep('otp');
                } else if (block.type === 'otp_verification_form') {
                  setFlowState({ ...flowState, code: data });
                  setCurrentStep('reset');
                }
              };

              return (
                <BlockComponent
                  key={idx}
                  settings={block.settings || {}}
                  state={flowState}
                  onSuccess={handleSuccess}
                />
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'auth-section',
  name: 'Auth Section',
  settings: [
    {
      type: 'select',
      id: 'mode',
      label: 'Mode',
      options: [
        { value: 'login', label: 'Login' },
        { value: 'register', label: 'Register' },
        { value: 'forgot-password', label: 'Forgot Password' }
      ],
      default: 'login'
    }
  ],
  blocks: [
    {
      type: 'auth_header',
      name: 'Header',
      settings: [
        { type: 'text', id: 'title', label: 'Title', default: 'Welcome back' },
        { type: 'text', id: 'subtitle', label: 'Subtitle', default: 'Sign in to your account' },
        { type: 'checkbox', id: 'show_logo', label: 'Show Logo', default: true },
        { type: 'color', id: 'title_color', label: 'Title Color' }
      ]
    },
    {
      type: 'login_form',
      name: 'Login Form',
      settings: [
        { type: 'text', id: 'button_text', label: 'Button Text', default: 'Sign In' },
        { type: 'color', id: 'button_color', label: 'Button Color' },
        { type: 'checkbox', id: 'show_forgot_password', label: 'Show Forgot Password', default: true },
        { type: 'checkbox', id: 'show_register_link', label: 'Show Register Link', default: true }
      ]
    },
    {
      type: 'register_form',
      name: 'Register Form',
      settings: [
        { type: 'text', id: 'button_text', label: 'Button Text', default: 'Create Account' },
        { type: 'color', id: 'button_color', label: 'Button Color' },
        { type: 'checkbox', id: 'show_terms', label: 'Show Terms Checkbox', default: true },
        { type: 'checkbox', id: 'show_login_link', label: 'Show Login Link', default: true }
      ]
    },
    {
      type: 'forgot_password_form',
      name: 'Forgot Password Form',
      settings: [
        { type: 'text', id: 'button_text', label: 'Button Text', default: 'Send Reset Code' },
        { type: 'color', id: 'button_color', label: 'Button Color' }
      ]
    },
    {
      type: 'otp_verification_form',
      name: 'OTP Verification Form',
      settings: [
        { type: 'text', id: 'button_text', label: 'Button Text', default: 'Verify Code' },
        { type: 'color', id: 'button_color', label: 'Button Color' }
      ]
    },
    {
      type: 'reset_password_form',
      name: 'Reset Password Form',
      settings: [
        { type: 'text', id: 'button_text', label: 'Button Text', default: 'Reset Password' },
        { type: 'color', id: 'button_color', label: 'Button Color' }
      ]
    },
    {
      type: 'social_auth',
      name: 'Social Auth',
      settings: [
        { type: 'checkbox', id: 'show_google', label: 'Show Google', default: true },
        { type: 'checkbox', id: 'show_apple', label: 'Show Apple', default: true }
      ]
    }
  ]
};
