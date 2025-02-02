import BuyCreditsDialog from "@/components/dialogs/buyCreditsDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/controllers/userController";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StudentProfilePage() {
  const user = await getCurrentUser();
  if (!user || !user.student) {
    return notFound();
  }
  const student = user.student;

  return (
    <>
      <Card className="my-2">
        <CardHeader>
          <CardTitle>
            {student.firstname} {student.lastname}
          </CardTitle>
          <CardDescription>
            Elev &bull; Puncte credit: {student.creditPoints}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold">Detalii</h3>
          <div className="my-2 py-2 px-3 rounded border">
            Nume: {user.student.lastname}
          </div>
          <div className="my-2 py-2 px-3 rounded border">
            Prenume: {user.student.firstname}
          </div>
          <div className="my-2 py-2 px-3 rounded border">
            Email: {user.email}
          </div>
          <ul>
            <li>
              <Button asChild variant="link">
                <Link href="/reset-password">Schimbă parola »</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="link">
                <Link href="#">Schimbă adresa de email »</Link>
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card className="my-2">
        <CardHeader>
          <CardTitle>Puncte credit: {student.creditPoints}</CardTitle>
          <CardDescription>Punctele credit sunt necesare pentru a putea susține un test.</CardDescription>
          <CardDescription>Acestea pot fi cumpărate sau obținute ca recompensă pentru rezultate bune la testele date.</CardDescription>
        </CardHeader>
        <CardContent>
          <BuyCreditsDialog studentId={student.id}>
            <Button variant="link">
              Cumpără puncte credit »
            </Button>
          </BuyCreditsDialog>
        </CardContent>
      </Card>
    </>
  );
}
