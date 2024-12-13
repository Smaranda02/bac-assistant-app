import { teacherSignUpAction } from "@/lib/actions/authActions";
import { FormMessage, Message } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Înregistrează-te ca profesor</h1>
        <p className="text-sm text text-foreground">
          Ai deja un cont?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Autentifică-te
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">Parolă</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton formAction={teacherSignUpAction} pendingText="Se crează contul...">
            Înregistrare
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
