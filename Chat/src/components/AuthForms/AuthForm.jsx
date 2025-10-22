// Chat/src/components/AuthForms/AuthForm.jsx
import React, { useState } from 'react';
import Silk from '../../DarkVeil/GradientBlinds';
import { COLORS } from '../../utils/constants';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/authContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const AuthForm = ({ mode, schema }) => {
  const isLogin = mode === 'login';
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async data => {
    setError(''); setLoading(true);
    try {
      if (isLogin) await login(data.email, data.password);
      else await signup(data.username, data.email, data.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen relative">
      <Silk speed={5} scale={1} color={COLORS.background} noiseIntensity={1.5} rotation={0} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-20 flex justify-center items-center p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm p-8 space-y-6" style={{ background: COLORS.formBg }}>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h1>
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">Full Name</label>
              <input id="username" {...register('username')} className="mt-1 block w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-md text-white placeholder-gray-300 focus:outline-none" />
              {errors.username && <p className="text-red-400 text-sm">{errors.username.message}</p>}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input id="email" type="email" {...register('email')} className="mt-1 block w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-md text-white" />
            {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input id="password" type="password" {...register('password')} className="mt-1 block w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-md text-white" />
            {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm Password</label>
              <input id="confirmPassword" type="password" {...register('confirmPassword')} className="mt-1 block w-full px-3 py-2 bg-white/10 border border-gray-600 rounded-md text-white" />
              {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword.message}</p>}
            </div>
          )}
          {error && <div className="p-3 bg-red-500/20 text-red-300 rounded-md text-center">{error}</div>}
          <button type="submit" disabled={loading} className="w-full py-3 px-4" style={{ background: COLORS.primary, color: '#fff' }}>
            {loading ? (isLogin ? 'Signing In...' : 'Signing Up...') : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
          <div className="text-center text-sm text-gray-300">
            {isLogin ? (
              <p>Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign Up</Link></p>
            ) : (
              <p>Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link></p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;

