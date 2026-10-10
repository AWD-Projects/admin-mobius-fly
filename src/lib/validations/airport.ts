import { z } from "zod";

const coordinate = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} es obligatoria.`)
    .refine((value) => {
      const n = Number(value);
      return Number.isFinite(n) && n >= min && n <= max;
    }, `${label} debe ser un número entre ${min} y ${max}.`);

/** Form values stay strings; `toAirportRow` converts them for the database. */
export const airportSchema = z.object({
  iata_code: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{3}$/, "El código IATA debe tener 3 letras.")
    .transform((value) => value.toUpperCase()),
  icao_code: z
    .string()
    .trim()
    .refine((value) => value === "" || /^[A-Za-z]{4}$/.test(value), "El código ICAO debe tener 4 letras.")
    .transform((value) => value.toUpperCase()),
  name: z.string().trim().min(1, "El nombre es obligatorio."),
  city: z.string().trim().min(1, "La ciudad es obligatoria."),
  state: z.string().trim(),
  country: z.string().trim().min(1, "El país es obligatorio."),
  latitude: coordinate("La latitud", -90, 90),
  longitude: coordinate("La longitud", -180, 180),
});

export type AirportFormValues = z.input<typeof airportSchema>;
export type AirportValues = z.output<typeof airportSchema>;

export function toAirportRow(values: AirportValues) {
  return {
    iata_code: values.iata_code,
    icao_code: values.icao_code || null,
    name: values.name,
    city: values.city,
    state: values.state || null,
    country: values.country,
    latitude: Number(values.latitude),
    longitude: Number(values.longitude),
  };
}
