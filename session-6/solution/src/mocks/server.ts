import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Den samme mock-backenden som i nettleseren (browser.ts), men for testene.
// Testene kjører i Node, ikke i en nettleser, så her brukes setupServer i stedet for setupWorker.
export const server = setupServer(...handlers);
