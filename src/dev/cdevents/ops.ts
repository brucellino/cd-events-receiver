/* 
    Operations Events.
    See https://github.com/cdevents/spec/blob/main/continuous-operations.md
*/

import { z } from "zod"
import { purlSchema, urlSchema } from "./types";
import { VocabularySchema } from "./schemas";
import { Environment, Service } from "./cd";

/* subject types */
const Incident = z.object({
    id: z.string(),
    source: urlSchema,
    type: VocabularySchema,
    description: z.string(),
    environment: Environment,
    service: Service,
    artifactId: purlSchema
});

const Ticket = z.object({
    id: z.string(),
    source: urlSchema,
    type: VocabularySchema,
    summary: z.string(),
    ticketType: z.enum(["bug", "enhancement", "incident", "task", "question", "custom-value"]),
    group: z.string(),
    creator: z.string(),
    assignees: z.string().array(),
    priority: z.enum(["high", "medium", "low", "custom-value"]),
    labels: z.string().array(),
    milestone: z.string(),
    url: z.string().url(),
    resolution: z.enum(["completed", "withdrawn", "custom-value"]),
    updatedBy: z.string()
});


/* 
    Operations Events
*/

const IncidentDetectedEventSchema = z.object({
    id: z.string(),
    source: urlSchema.optional(),
    type: VocabularySchema,
    description: z.string().optional(),
    environment: Environment,
    service: Service.optional(),
    artifactId: purlSchema.optional()
});

const IncidentReportedEventSchema = z.object({
    id: z.string(),
    source: urlSchema.optional(),
    type: VocabularySchema,
    description: z.string(),
    environment: Environment,
    ticketURI: urlSchema,
    service: Service.optional(),
    artifactId: purlSchema.optional()
});

const IncidentResolvedEventSchema = z.object({
    id: z.string(),
    source: urlSchema.optional(),
    type: VocabularySchema,
    description: z.string(),
    environment: Environment,
    service: Service.optional(),
    artifactId: purlSchema.optional()
});

const TicketCreatedEventSchema = z.object({
    id: z.string(),
    source: urlSchema,
    type: VocabularySchema,
    summary: z.string(),
    ticketType: z.enum(["bug", "enhancement", "incident", "task", "question", "custom-value"]),
    group: z.string(),
    creator: z.string(),
    assignees: z.string().array(),
    priority: z.enum(["high", "medium", "low", "custom-value"]),
    labels: z.string().array(),
    milestone: z.string(),
    url: z.string().url()
});

const TicketUpdateEventSchema = z.object({
    id: z.string(),
    source: urlSchema,
    type: VocabularySchema,
    summary: z.string(),
    ticketType: z.enum(["bug", "enhancement", "incident", "task", "question", "custom-value"]),
    group: z.string(),
    creator: z.string(),
    assignees: z.string().array(),
    priority: z.enum(["high", "medium", "low", "custom-value"]),
    labels: z.string().array(),
    milestone: z.string(),
    url: z.string().url(),
    updatedBy: z.string()
});

const TicketClosedEventSchema = z.object({
    id: z.string(),
    source: urlSchema,
    type: VocabularySchema,
    summary: z.string(),
    ticketType: z.enum(["bug", "enhancement", "incident", "task", "question", "custom-value"]),
    group: z.string(),
    creator: z.string(),
    assignees: z.string().array(),
    priority: z.enum(["high", "medium", "low", "custom-value"]),
    labels: z.string().array(),
    milestone: z.string(),
    url: z.string().url(),
    resolution: z.enum(["completed", "withdrawn", "custom-value"]),
    updatedBy: z.string()
});

export type Incident = z.infer<typeof Incident>;
export type Ticket = z.infer<typeof Ticket>;
export type IncidentDetected = z.infer<typeof IncidentDetectedEventSchema>;
export type IncidentReported = z.infer<typeof IncidentReportedEventSchema>;
export type IncidentResolved = z.infer<typeof IncidentResolvedEventSchema>;
export type TicketCreated = z.infer<typeof TicketCreatedEventSchema>;
export type TicketUpdated = z.infer<typeof TicketUpdateEventSchema>;
export type TicketClosed = z.infer<typeof TicketClosedEventSchema>;
