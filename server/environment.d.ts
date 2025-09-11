declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLERK_PUBLISHABLE_KEY: string,
      CLERK_SECRET_KEY: string,
      DATABASE_URL: string,

      GOOGLE_OAUTH_CLIENT_ID: string,
      GOOGLE_OAUTH_CLIENT_SECRET: string,
      GOOGLE_OAUTH_REDIRECT_URL: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { }
