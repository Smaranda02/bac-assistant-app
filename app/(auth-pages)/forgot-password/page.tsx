import { forgotPasswordAction } from "@/lib/actions/authActions";
import { FormMessage, Message } from "@/components/forms/form-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <Card className="p-4">
      <form className="flex-1 flex flex-col gap-2 text-foreground [&>input]:mb-6 min-w-96 mx-auto">
        <div>
          <h1 className="text-2xl font-medium">Resetare parolă</h1>
        </div>
        <FormMessage message={searchParams} />
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-5">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <SubmitButton formAction={forgotPasswordAction}>
            Resetare parolă
          </SubmitButton>
        </div>
      </form>
    </Card>
  );
}
