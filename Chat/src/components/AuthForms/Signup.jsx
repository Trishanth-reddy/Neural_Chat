import React from 'react';
import AuthForm from './AuthForm';
import { signupSchema } from '../../utils/validation';

export default function Signup() {
  return <AuthForm mode="signup" schema={signupSchema} />;
}

