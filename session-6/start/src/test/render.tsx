import type { ReactElement } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createQueryClient } from "../queryClient";

// Rendrer en komponent med det den trenger rundt seg, slik main.tsx gjør i appen.
// Hver test får sin egen QueryClient, så cachen fra én test ikke lekker over i neste.
// Returnerer også user, som du bruker til å klikke og skrive: await user.click(...).
export function renderWithProviders(ui: ReactElement) {
  const queryClient = createQueryClient({ retry: false });
  const user = userEvent.setup();
  const result = render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  return { user, ...result };
}
