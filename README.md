# Mobius Admin Dashboard

Panel interno de Mobius Fly para aprobar vuelos, documentos de propietarios y
aeronaves, tripulación, gestionar cuentas de propietarios y el catálogo de
aeropuertos. Comparte el proyecto Supabase con la plataforma principal.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · shadcn/ui ·
Supabase (Auth + Postgres) · React Hook Form + Zod.

## Variables de entorno (`.env.local`)

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sesión del admin (login y verificación en `admin_users`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Mutaciones desde server actions. **Nunca** en el cliente. |

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Acceso

Solo entran usuarios de Supabase Auth presentes en la tabla `admin_users`
(un único rol). Las altas se hacen a mano en Supabase Studio:

```sql
insert into admin_users (user_id, email) values ('<auth.users.id>', '<correo>');
```

## Estructura

- `src/proxy.ts` — protege todas las rutas (sesión + `admin_users`).
- `src/app/(dashboard)/` — dashboard, aprobaciones, owners, vuelos, aeropuertos.
- `src/app/actions/` — server actions con service role. Cada una llama a
  `requireAdmin()` (`src/lib/auth.ts`) y condiciona el `UPDATE` al estado previo.
- `src/lib/queue.ts`, `documents.ts`, `catalog.ts` — consultas y reglas compartidas.

## Notas de esquema (producción)

- Vuelo aprobado = `SCHEDULED`; rechazado = `REJECTED` con `rejected_reason`.
- Tripulante: `status` e `is_approved` se escriben juntos; la fuente de verdad es `is_approved`.
- La aprobación de una aeronave vive en sus `aircraft_documents`, no en `aircrafts.status`.
- `aircraft_has_all_docs_approved` exige 3 tipos: `PROOF_OF_OWNERSHIP`, `PERMITS`, `POWER_OF_ATTORNEY`.
- Solo `flights` referencia `airports`; `aircrafts` no tiene `home_airport_id`.
