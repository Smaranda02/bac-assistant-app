import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <Card className="max-w-2xl w-full mx-auto text-center">
      <CardHeader>
        <CardTitle>
          Conținutul specificat nu a putut fi găsit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/">Înapoi la pagina principală</Link>
        </Button>
      </CardContent>
    </Card>
  )
}