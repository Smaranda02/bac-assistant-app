import { createClient } from "@/utils/supabase/server"
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StudentHome()
{
  const supabase = await createClient();

  const { data: Subjects, error } = await supabase
    .from("Subjects")
    .select("*");


    const { data: tests, error: testError } = await supabase
    .from("PracticeTests")
    .select("id, name")
    .gte("created_at", new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString());
    ;

  if (error) {
    console.error("Error fetching Subjects:", error.message);
    return { error };
  }  
  
  const {data: {user} } = await supabase.auth.getUser();
  const studentEmail = user?.user_metadata?.email;

  if (error) {
    console.log("Error:", error);
  }
  
  return (
    <>
      
      <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Bine ai venit, {studentEmail} !</h1>

      <h2 className="mt-10 text-2xl font-bold mb-6 text-center">Alege o materie </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
        {Subjects && Subjects.length > 0 ? (
          Subjects.map((subject) => (
            <Link key={subject.id} href={`/${subject.id}/content`}>
              <Card className="hover:shadow-lg cursor-pointer transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{subject.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Exploreaza optiunile pentru <strong>{subject.name}</strong>.
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            <p>No subjects found. Please check back later.</p>
          </div>
        )}
      </div>

      <h2 className="mt-10 text-2xl font-bold mb-6 text-center">Ultimele teste adaugate </h2>
        {tests && tests.length > 0 ? (
          <div className="space-y-4">
            {tests.map((test) => (
              <Link key={test.id} href={`/student/take-test/${test.id}`} passHref>
                <p className="block text-xl text-blue-600 hover:underline">{test.name}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Nu exista teste disponibile in utlimele 48 de ore.</p>
        )}
    </div>
    </>
  )
}
