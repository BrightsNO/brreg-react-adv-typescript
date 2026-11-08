import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { reportError } from "./monitoring";

// Lager QueryClient for appen. Brukes både i main.tsx og i testene (src/test/render.tsx),
// så testene kjører med det samme oppsettet som appen, også feilrapporteringen fra økt 5.
export function createQueryClient({ retry = 1 }: { retry?: number | false } = {}): QueryClient {
  return new QueryClient({
    // retry: 1 betyr ett nytt forsøk ved feil (standard er tre), så feil vises raskere i kurset.
    // Testene bruker retry: false, så en feil vises med en gang.
    defaultOptions: {
      queries: { retry },
    },
    // Alle feil fra spørringer og endringer rapporteres herfra (økt 5).
    queryCache: new QueryCache({
      onError: (error, query) => reportError(error, { kilde: "query", queryKey: JSON.stringify(query.queryKey) }),
    }),
    mutationCache: new MutationCache({
      onError: (error) => reportError(error, { kilde: "mutation" }),
    }),
  });
}
