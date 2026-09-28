import { z } from "zod";

export const eventStatusSchema = z.enum(["scheduled", "done", "canceled"]);

export const eventFieldsSchema = z.object({
  leadId: z.uuid("Lead inválido.").nullable(),
  title: z.string().trim().min(1, "Informe o título do evento.").max(160),
  description: z.string().trim().max(5000).nullable(),
  startsAt: z.coerce.date({ error: "Data de início inválida." }),
  endsAt: z.coerce.date({ error: "Data de término inválida." }),
  status: eventStatusSchema,
});
