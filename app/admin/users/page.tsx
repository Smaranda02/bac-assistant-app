import { Badge } from "@/components/ui/badge";
import { getAllUsers } from "@/lib/controllers/userController"
import { notFound } from "next/navigation";

export default async function AdminUsersPage() {
  const users = await getAllUsers();
  if (!users) {
    return notFound();
  }

  return (
    <>
      <h2 className="text-xl font-bold mb-2">Elevi</h2>
      <ul>
        {users.students.map(s => (
          <li className="my-2 px-3 py-2 border rounded flex gap-2 items-center bg-white" key={`test-${s.id}`}>
            <div className="mr-auto py-1">
              <div className="">{s.firstname} {s.lastname}</div>
              <div className="text-sm text-muted-foreground">
                {s.email}
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-300 hover:bg-green-300">{s.creditPoints} puncte credit</Badge>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-bold mb-2">Profesori</h2>
      <ul>
        {users.teachers.map(t => (
          <li className="my-2 px-3 py-2 border rounded flex gap-2 items-center bg-white" key={`test-${t.id}`}>
          <div className="mr-auto py-1">
            <div className="">{t.firstname} {t.lastname}</div>
            <div className="text-sm text-muted-foreground">
              {t.email}
            </div>
          </div>
          <Badge variant="secondary">{t.subject.name}</Badge>
        </li>
        ))}
      </ul>
    </>
  )
}
