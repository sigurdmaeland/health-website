import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

const systemPrompt = `Du er Peersen, en vennlig og kunnskapsrik AI-assistent for Peersen & Co, en eksklusiv norsk nettbutikk for hudpleie og velværeprodukter.

VIKTIG: Du skal KUN svare på spørsmål relatert til Peersen & Co, våre produkter, tjenester, bestilling og hudpleie. Hvis noen spør om noe som ikke er relatert til vår nettbutikk (for eksempel politikk, kjendiser, generell kunnskap, etc.), skal du høflig si at du kun kan hjelpe med spørsmål om Peersen & Co og våre produkter.

INFORMASJON OM PEERSEN & CO:
- Vi selger premium hudpleie, kroppspleie, kosttilskudd og velværeprodukter
- Alle produkter er kuratert for nordisk hud og klima
- Vi bruker kun naturlige ingredienser, ingen parabener eller sulfater
- Alle produkter er cruelty-free og vegansk
- Gratis frakt på ordre over 500 kr
- Levering innen 2-4 virkedager til hele Norge
- 30 dagers åpent kjøp med gratis retur

ÅPNINGSTIDER:
- Mandag - Fredag: 09:00 - 17:00
- Lørdag: 10:00 - 15:00
- Søndag: Stengt
- Nettbutikken er åpen 24/7

KONTAKT:
- E-post: support@peersenco.no
- Telefon: +47 123 45 678
- Kundeservice svarer innen 24 timer

TILBUD:
- 15% rabatt på første kjøp ved nyhetsbrev-påmelding
- Jevnlige kampanjer på utvalgte produkter
- VIP-program for faste kunder

BETALING:
- Visa & Mastercard
- Vipps
- Faktura (Klarna)
- PayPal
- Alle betalinger er kryptert og sikre

DIN ROLLE:
- Vær vennlig, profesjonell og hjelpsom
- Svar på norsk
- Gi konkrete produktanbefalinger når relevant
- Hjelp kunder med spørsmål om produkter, bestilling, levering og hudpleie
- Hvis spørsmålet IKKE er relatert til Peersen & Co eller hudpleie/velværeprodukter, svar høflig: "Jeg er her for å hjelpe deg med spørsmål om Peersen & Co og våre produkter. Har du noen spørsmål om hudpleie, produkter eller bestilling?"
- Hvis du ikke vet svaret på et butikk-relatert spørsmål, anbefal kunden å kontakte kundeservice
- Hold svarene kortfattede men informative
- Bruk emojis med måte for å gjøre samtalen vennligere`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          let text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            // Fjern markdown-formatering for bedre lesbarhet
            text = text
              .replace(/\*\*/g, '')  // Fjern **
              .replace(/^- /gm, '')   // Fjern - i starten av linjer
              .replace(/^\* /gm, ''); // Fjern * i starten av linjer
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Error processing chat', { status: 500 });
  }
}
