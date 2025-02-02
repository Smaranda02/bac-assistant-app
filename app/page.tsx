import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Index() {

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Bine ai venit la BAC Asisstant
          </h1>
          <p className="text-xl mb-8">
            Aplicația ta pentru învățat ușor și eficient
          </p>
          <Button>
            <Link  href={`/student`}>Vezi cursuri</Link>
          </Button>
        </div>
      </header>

      <section className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Ce aducem</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-4">
                Feedback din partea profesorilor
              </h3>
              <p>
                Trimite-ți tema pentru evaluare din partea profesorului tău de
                la clasă sau a profesorilor noștri
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-4">Materia ta. Mai simplu</h3>
              <p>
                {" "}
                Învață mai ușor și mai eficient cu ajutorul cursurilor noastre
                interactive și a testelor de autoevaluare
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-4"> Învățatul ca un joc</h3>
              <p>
                {" "}
                Învață și testează-ți cunoștințele într-un mod distractiv și
                interactiv, fiind premiat pentru fiecare reușită
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
