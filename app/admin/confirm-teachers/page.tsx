import { SubmitButton } from "@/components/forms/submit-button";
import { Badge } from "@/components/ui/badge";
import { confirmTeacherAction } from "@/lib/actions/adminActions";
import { getUnconfirmedTeachers } from "@/lib/controllers/adminController";

export default async function AdminConfirmTeachers() {
  const unconfirmedTeachers = await getUnconfirmedTeachers();

  return (
    <div>
      <ul>
        {unconfirmedTeachers.map(t => (
          <li className="my-2 px-3 py-2 border rounded flex gap-2 items-center bg-white" key={`test-${t.id}`}>
          <div className="mr-auto py-1">
            <div className="">{t.firstname} {t.lastname}</div>
            <div className="text-sm text-muted-foreground">
              {t.email}
            </div>
          </div>
          <Badge variant="secondary" className="mr-20">{t.subject}</Badge>
          <form action={confirmTeacherAction.bind(null, t.id)}>
            <SubmitButton size="sm">Confirmă cont</SubmitButton>
          </form>
        </li>
        ))}
      </ul>
      {unconfirmedTeachers.length === 0 && (
        <div className="text-muted-foreground text-center my-4">Nu există niciun cont de profesor care așteaptă să fie confirmat.</div>
      )}
    </div>
  );
}
