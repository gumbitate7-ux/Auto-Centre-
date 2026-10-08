/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Optional URL that receives quote requests as multipart/form-data
   * (e.g. a Formspree, Getform or custom endpoint). When unset, the
   * form runs in demo mode and nothing is sent.
   */
  readonly VITE_QUOTE_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
