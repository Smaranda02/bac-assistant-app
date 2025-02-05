import { teacherSignUpAction } from "@/lib/actions/authActions";
import { FormMessage, Message } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getSubjects } from "@/lib/controllers/contentController";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";

export default async function Signup(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  if (searchParams && "message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  const subjects = await getSubjects();

  return (
    <Card className="p-4">
      <form className="flex flex-col min-w-96 mx-auto">
        <h1 className="text-2xl font-medium">Înregistrează-te ca profesor</h1>
        <p className="text-sm text text-foreground">
          Ai deja un cont?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Autentifică-te
          </Link>
        </p>
        <FormMessage message={searchParams} />
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-5">
          <Label htmlFor="lastName">Nume</Label>
          <Input name="lastName" placeholder="Numele tău" required />

          <Label htmlFor="firstName">Prenume</Label>
          <Input name="firstName" placeholder="Prenumele tău" required />

          <Label htmlFor="subject">Materie</Label>
          <Select name="subject" required>
            <SelectTrigger>
              <SelectValue placeholder="Materie" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(s => (
                <SelectItem value={s.id.toString()} key={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="profesorul@exemplu.com" required />
          <Label htmlFor="password">Parolă</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
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
          <SubmitButton formAction={teacherSignUpAction} pendingText="Se crează contul...">
            Înregistrare
          </SubmitButton>
        </div>
      </form>
    </Card>
  );
}
