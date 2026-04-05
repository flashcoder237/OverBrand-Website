/**
 * Root-level not-found — catches 404s that fall outside the [locale] segment
 * (e.g. direct access to /unknown-path with no locale prefix).
 * Redirects to the French homepage.
 */
import { redirect } from 'next/navigation'

export default function RootNotFound() {
  redirect('/fr')
}
