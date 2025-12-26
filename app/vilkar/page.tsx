export default function VilkarPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
          Vilkår og betingelser
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-gray-600">
            Sist oppdatert: {new Date().toLocaleDateString('no-NO')}
          </p>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Generelt</h2>
            <p className="text-gray-700 leading-relaxed">
              Disse vilkårene gjelder for kjøp av varer fra Helsebutikk AS, 
              organisasjonsnummer 123 456 789, og regulerer forholdet mellom deg som 
              kunde og oss som selger. Ved å handle hos oss godtar du disse vilkårene.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Priser</h2>
            <p className="text-gray-700 leading-relaxed">
              Alle priser er oppgitt i norske kroner (NOK) og inkluderer merverdiavgift 
              (MVA). Vi forbeholder oss retten til å endre priser uten forvarsel, men 
              prisen som var gjeldende da du la produktet i handlekurven vil gjelde for 
              ditt kjøp.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Levering</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>Leveringstid:</strong> Normalt 2-4 virkedager fra bestilling er bekreftet. 
                Ved forsinket levering vil du bli varslet.
              </p>
              <p>
                <strong>Fraktkostnader:</strong> 79,- (gratis frakt over 500,-)
              </p>
              <p>
                <strong>Leveringsmetode:</strong> Vi leverer med Posten/Bring til 
                postboks, hentested eller hjemlevering.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Betaling</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vi aksepterer følgende betalingsmetoder:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Vipps</li>
              <li>• Visa/Mastercard</li>
              <li>• Klarna (faktura og delbetaling)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Alle betalinger behandles sikkert gjennom krypterte kanaler.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Angrerett</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Du har 14 dagers angrerett fra du mottar varene. For å bruke angreretten må du:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Gi oss beskjed innen fristen</li>
              <li>• Returnere produktet i ubrukt stand</li>
              <li>• Produktet må være i original emballasje</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Du dekker returfrakt. Ved bruk av angreretten får du pengene tilbake 
              innen 14 dager fra vi mottar varen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Reklamasjon</h2>
            <p className="text-gray-700 leading-relaxed">
              Vi gir 2 års reklamasjonsrett i henhold til forbrukerkjøpsloven. 
              Varen skal være som avtalt og fri for mangler. Ved reklamasjon, 
              kontakt vår kundeservice så hjelper vi deg videre.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Personvern</h2>
            <p className="text-gray-700 leading-relaxed">
              Vi behandler dine personopplysninger i henhold til personopplysningsloven 
              og GDPR. Les vår{' '}
              <a href="/personvern" className="text-[#88B5A0] hover:underline">
                personvernerklæring
              </a>{' '}
              for mer informasjon.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Kontakt</h2>
            <div className="p-6 bg-[#F5F5F0] rounded-lg">
              <p className="text-gray-700">
                <strong>Helsebutikk AS</strong><br />
                Org.nr: 123 456 789<br />
                E-post: post@helsebutikk.no<br />
                Telefon: +47 123 45 678<br />
                Adresse: Storgata 1, 0123 Oslo
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
