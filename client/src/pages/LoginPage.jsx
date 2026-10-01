import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { FormField } from "../components/FormField";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { FormAlert } from "../components/FormAlert";
import { PasswordInput } from "../features/auth/components/PasswordInput";
import { DemoCredentials } from "../features/auth/components/DemoCredentials";
import { LOGIN_ERROR_OVERRIDES, useLogin } from "../features/auth/hooks";
import { loginSchema } from "../features/auth/schemas";
import { applyServerFieldErrors, getErrorMessage } from "../lib/errors";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { IS_DEV } from "../lib/env";

export function LoginPage() {
  useDocumentTitle("Log in");
  const login = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  // Redirect after success is handled by PublicOnlyRoute (returns to `from` or /dashboard).
  const onSubmit = (values) => login.mutate(values, { onError: (error) => applyServerFieldErrors(error, setError) });
  const formError = login.error && login.error.status !== 422 ? getErrorMessage(login.error, LOGIN_ERROR_OVERRIDES) : null;

  return (
    <>
      <h1 className="text-xl font-semibold text-slate-900">Log in to your account</h1>
      <p className="mt-1 text-sm text-slate-600">Welcome back. Enter your details to continue.</p>
      <FormAlert message={formError} />

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <FormField label="Email" error={errors.email?.message}>
          {(field) => <Input {...field} type="email" autoComplete="email" inputMode="email" {...register("email")} />}
        </FormField>
        <FormField label="Password" error={errors.password?.message}>
          {(field) => <PasswordInput {...field} autoComplete="current-password" {...register("password")} />}
        </FormField>
        <Button type="submit" className="w-full" isLoading={login.isPending} loadingText="Logging in...">
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="rounded font-medium text-indigo-700 hover:text-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          Create one
        </Link>
      </p>

      {IS_DEV && <DemoCredentials />}
    </>);

}