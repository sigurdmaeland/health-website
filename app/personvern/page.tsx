export default function PersonvernPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
          Personvernerklæring
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-gray-600">
            Sist oppdatert: {new Date().toLocaleDateString('no-NO')}
          </p>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Innledning</h2>
            <p className="text-gray-700 leading-relaxed">
              Helsebutikk AS ("vi", "vår" eller "oss") respekterer ditt personvern og er 
              forpliktet til å beskytte dine personopplysninger. Denne personvernerklæringen 
              forklarer hvordan vi samler inn, bruker og beskytter informasjonen din når du 
              besøker vår nettside eller kjøper produkter fra oss.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Informasjon vi samler inn
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vi kan samle inn følgende typer personopplysninger:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Kontaktinformasjon (navn, e-postadresse, telefonnummer)</li>
              <li>• Leveringsadresse</li>
              <li>• Betalingsinformasjon</li>
              <li>• Kjøpshistorikk og preferanser</li>
              <li>• Informasjonskapsler og bruksdata</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Hvordan vi bruker informasjonen
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vi bruker dine personopplysninger til å:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Behandle og levere bestillinger</li>
              <li>• Kommunisere med deg om ordre og henvendelser</li>
              <li>• Forbedre våre produkter og tjenester</li>
              <li>• Sende markedsføring (kun med samtykke)</li>
              <li>• Oppfylle juridiske forpliktelser</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Deling av informasjon
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Vi selger eller leier aldri ut dine personopplysninger til tredjeparter. 
              Vi kan dele informasjon med leverandører som hjelper oss med å levere 
              tjenester (f.eks. betalingsleverandører, fraktselskaper), men kun i den 
              grad det er nødvendig.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Dine rettigheter</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              I henhold til GDPR har du rett til å:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Få innsyn i dine personopplysninger</li>
              <li>• Rette feil i opplysningene</li>
              <li>• Slette dine opplysninger</li>
              <li>• Begrense behandlingen</li>
              <li>• Protestere mot behandling</li>
              <li>• Dataportabilitet</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Informasjonskapsler</h2>
            <p className="text-gray-700 leading-relaxed">
              Vi bruker informasjonskapsler for å forbedre din opplevelse på nettstedet. 
              Du kan kontrollere bruken av informasjonskapsler gjennom nettleserinnstillingene dine.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Kontakt oss</h2>
            <p className="text-gray-700 leading-relaxed">
              Hvis du har spørsmål om denne personvernerklæringen eller ønsker å utøve 
              dine rettigheter, kan du kontakte oss på:
            </p>
            <div className="mt-4 p-6 bg-[#F5F5F0] rounded-lg">
              <p className="text-gray-700">
                <strong>Helsebutikk AS</strong><br />
                E-post: personvern@helsebutikk.no<br />
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
