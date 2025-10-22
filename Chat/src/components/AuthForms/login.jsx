import React from 'react';
import AuthForm from './AuthForm';
import { loginSchema } from '../../utils/validation';

export default function Login() {
  return <AuthForm mode="login" schema={loginSchema} />;
}

