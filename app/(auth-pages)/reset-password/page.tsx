import { resetPasswordAction } from "@/lib/actions/authActions";
import { FormMessage, Message } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <Card className="p-4">
      <form className="flex flex-col min-w-96 p-4 gap-2 [&>input]:mb-4">
        <h1 className="text-2xl font-medium">Resetare parolă</h1>
        <p className="text-sm text-foreground/60">
          Întroduceți mai jos noua parolă
        </p>
        <FormMessage message={searchParams} />
        <Label htmlFor="password" className="mt-5">Parolă nouă</Label>
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
      </form>
    </Card>
  );
}
