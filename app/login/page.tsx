'use client';

import AuthFormContainer from "@/components/molecules/AuthFormContainer";
import LoginForm from "@/components/organisms/LoginForm";

export default function LoginPage() {
  return (
    <AuthFormContainer title="Sign In">
      <LoginForm />
    </AuthFormContainer>
  );
} 