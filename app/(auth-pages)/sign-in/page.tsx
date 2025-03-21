import { signInAction } from "@/lib/actions/authActions";
import { FormMessage, Message } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <Card className="p-4">
      <form className="flex flex-col min-w-96 mx-auto">
        <h1 className="text-2xl font-medium">Autentificare</h1>
        <FormMessage message={searchParams} />
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-5">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Parolă</Label>
            <Link
              className="text-xs text-foreground underline"
              href="/forgot-password"
            >
              Ai uitat parola?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Parolă"
            required
          />
          <SubmitButton pendingText="În curs de autentificare..." formAction={signInAction}>
            Autentificare
          </SubmitButton>
        </div>
      </form>
    </Card>
  );
}
