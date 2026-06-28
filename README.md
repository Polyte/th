
  # TH Attorneys Law Firm Website

  This is a code bundle for TH Attorneys Law Firm Website. The original project is available at https://www.figma.com/design/NNQGmnD8DZOKmqtA7S4pZV/TH-Attorneys-Law-Firm-Website.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Backend configuration

  The public app uses the Supabase Edge Function URL already configured in `src/app/services/supabaseClient.ts`.
  The edge function now stores website data in Turso/libSQL, not Supabase KV.

  Configure these secrets for the edge function:

  - `TURSO_DATABASE_URL`: Turso database URL.
  - `TURSO_AUTH_TOKEN`: Turso database auth token.
  - `ADMIN_SETUP_KEY`: private setup key required to create admin users.
  - `SUPABASE_URL`: still required for Supabase Auth.
  - `SUPABASE_SERVICE_ROLE_KEY`: still required for Supabase Auth admin operations.

  Turso creates the `lawyers`, `appointments`, and `enquiries` tables automatically on first request.
