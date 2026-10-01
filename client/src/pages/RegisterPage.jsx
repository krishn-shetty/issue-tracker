import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { FormField } from "../components/FormField";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { PasswordInput } from "../features/auth/components/PasswordInput";
import { useRegister } from "../features/auth/hooks";
import { registerSchema } from "../features/auth/schemas";
import { applyServerFieldErrors } from "../lib/errors";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const DEFAULT_VALUES = { name: "", email: "", password: "", confirmPassword: "" };
const EMAIL_TAKEN_MESSAGE = "Email is already registered";

export function RegisterPage() {
  useDocumentTitle("Create account");
  const registerUser = useRegister();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({ resolver: zodResolver(registerSchema), defaultValues: DEFAULT_VALUES });

  function handleServerError(error) {
    if (error.status === 409) {
      setError("email", { type: "server", message: error.message || EMAIL_TAKEN_MESSAGE });
      return;
    }
    applyServerFieldErrors(error, setError);
  }

  // confirmPassword is client-only and never sent. The server sets the session cookie,
  // so PublicOnlyRoute moves the user to /dashboard once auth.me is populated.
  const onSubmit = ({ name, email, password }) =>
  registerUser.mutate({ name, email, password }, { onError: handleServerError });

  return (
    <>
      <h1 className="text-xl font-semibold text-slate-900">Create your account</h1>
      <p className="mt-1 text-sm text-slate-600">Start tracking and resolving issues with your team.</p>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <FormField label="Name" error={errors.name?.message}>
          {(field) => <Input {...field} autoComplete="name" {...register("name")} />}
        </FormField>
        <FormField label="Email" error={errors.email?.message}>
          {(field) => <Input {...field} type="email" autoComplete="email" inputMode="email" {...register("email")} />}
        </FormField>
        <FormField
          label="Password"
          error={errors.password?.message}
          hint={errors.password ? undefined : "8-72 characters, with a letter and a number."}>
          
          {(field) => <PasswordInput {...field} autoComplete="new-password" {...register("password")} />}
        </FormField>
        <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
          {(field) => <PasswordInput {...field} autoComplete="new-password" {...register("confirmPassword")} />}
        </FormField>
        <Button type="submit" className="w-full" isLoading={registerUser.isPending} loadingText="Creating account...">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="rounded font-medium text-indigo-700 hover:text-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          Log in
        </Link>
      </p>
    </>);

}