/// <reference types="vite/client" />

// Typer for miljøvariablene våre, så import.meta.env.VITE_... ikke blir any.
interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
  readonly VITE_APM_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
