'use client';

import AuthFormContainer from "@/components/molecules/AuthFormContainer";
import SignupForm from "@/components/organisms/SignupForm";

export default function SignupPage() {
  return (
    <AuthFormContainer title="Sign Up">
      <SignupForm />
    </AuthFormContainer>
  );
} 