export default function SubmissionSuccess() {
  return (
    <main className="container mx-auto min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-4">Răspunsurile tale au fost trimise cu succes!</h1>
        <p className="text-lg">
          Mulțumim pentru timpul acordat. Poți reveni la pagina principală sau continua să explorezi.
        </p>
        <div className="mt-6 flex gap-4">
          <a
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition"
          >
            Înapoi la Acasă
          </a>
          <a
            href="/student"
            className="inline-block px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-md shadow hover:bg-gray-300 transition"
          >
            Continuă în pagina studentului
          </a>
        </div>
      </div>
    </main>
  );
}
