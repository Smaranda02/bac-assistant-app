import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default async function ChapterPage({ params }: { params: Promise<{ chapter: string }> }) {

  const supabase = await createClient();
  const {chapter} = await params;
  const chapterId = decodeURIComponent(chapter);

  const getFileName = (url: string | null) => {
    if( !url ) return "Unknown file"

    const fullName =  url.split('/').pop() || "Unknown file";
    const cleanName = fullName.split('.')[0];
    const noSpaceFileName = cleanName.replace(/%20/g, "_");
    return noSpaceFileName || "Unknown file";
  };

  const { data: chapterName, error: chaptersError } = await supabase
    .from("SubjectChapters")
    .select("name")
    .eq("id", chapterId)
    .single()
    ;


  const { data: chapterMaterials, error: materialsError } = await supabase
    .from("Materials")
    .select("contentURL")
    .eq("chapterId", chapterId)
    .not("contentURL", 'is', null);

    // console.log(chapterMaterials);

    if (materialsError) {
      console.error("Error fetching chapter materials:", materialsError.message);
      return <div className="text-red-500">Eroare la incarcarea materialelor. Te rugam incearca din nou mai tariu.</div>;
    }

    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Capitol {chapterName?.name}</h1>
        {chapterMaterials && chapterMaterials.length > 0 ? (
          <div className="grid grid-cols-2 gap-6">
            {chapterMaterials.map((material, index) => (
              <Card key={index} className="w-full hover:shadow-lg transition-all duration-300 ">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Document {getFileName(material?.contentURL)}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-gray-600 mb-4">
                      <p>Fisier disponibil pentru descarcare</p>
                    </div>
                
                  {/* File link */}
                  <Link href={material?.contentURL || ""} target="_blank" rel="noopener noreferrer">
                    <p className="text-blue-600 hover:underline">Deschide documentul</p>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            <p>Nu exista materiale disponibile pentru acest capitol inca...</p>
          </div>
        )}
      </div>
    );
}