import { GraphQLClient } from 'graphql-request'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * GraphQL client pointing at Supabase's built-in pg_graphql endpoint.
 * Usable in Server Components, API routes, and anywhere Node.js runs.
 */
export const gqlClient = new GraphQLClient(
  `${SUPABASE_URL}/graphql/v1`,
  {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  }
)

/**
 * Authenticated GraphQL client — pass the user's JWT to respect RLS.
 */
export function getAuthGqlClient(jwt: string) {
  return new GraphQLClient(`${SUPABASE_URL}/graphql/v1`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${jwt}`,
    },
  })
}
