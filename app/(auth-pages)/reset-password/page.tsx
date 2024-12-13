import { resetPasswordAction } from "@/lib/actions/authActions";
import { FormMessage, Message } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
      <h1 className="text-2xl font-medium">Resetare parolă</h1>
      <p className="text-sm text-foreground/60">
        Întroduceți mai jos noua parolă
      </p>
      <Label htmlFor="password">Parolă nouă</Label>
      <Input
        type="password"
        name="password"
        placeholder="Parolă nouă"
        required
      />
      <Label htmlFor="confirmPassword">Confirmare parolă</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirmare parolă"
        required
      />
      <SubmitButton formAction={resetPasswordAction}>
        Resetare parolă
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
}
