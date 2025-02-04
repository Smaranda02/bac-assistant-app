import { studentSignUpAction } from "@/lib/actions/authActions";
import { FormMessage, Message } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Card } from "@/components/ui/card";

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
    <Card className="p-4">
      <form className="flex flex-col min-w-96 mx-auto">
        <h1 className="text-2xl font-medium">Înregistrează-te ca elev</h1>
        <p className="text-sm text text-foreground">
          Ai deja un cont?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Autentifică-te
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="lastName">Nume</Label>
          <Input name="lastName" placeholder="Numele tău" required />
          
          <Label htmlFor="firstName">Prenume</Label>
          <Input name="firstName" placeholder="Prenumele tău" required />

          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="elevul@exemplu.com" required />

          <Label htmlFor="password">Parolă</Label>
          <Input
            type="password"
            name="password"
            placeholder="Parola ta"
            minLength={6}
            required
          />

          <Label htmlFor="confirmPassword">Confirmă parola</Label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Repetă parola"
            minLength={6}
            required
          />

          <SubmitButton formAction={studentSignUpAction} pendingText="Se crează contul...">
            Înregistrare
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </Card>
  );
}
