/**
 * User search text is interpolated into PostgREST `or()`/`ilike` filters, which
 * are comma/paren-delimited and treat `%` and `*` as wildcards — strip them.
 */
export function sanitizeSearch(value: string) {
  return value.replace(/[,()%*\\]/g, " ").trim();
}
