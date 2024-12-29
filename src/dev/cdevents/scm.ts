import { z } from 'zod';

// base schema for all CD Events
export const cdEventsVersion = z.literal('0.2.0')

export const cdEventBaseSchema = z.object({
    type: z.string(),
    source: z.string().url(),
    subject: z.string(),
    data: z.object({
        id: z.string(),
    }).optional(),
    timestamp: z.string().datetime()
})

export const cdEventSubjectSchema = z.object({
    id: z.string(),
    source: z.string(),
    type: z.string(),
    content: z.unknown().optional()
})
export const cdEventLinkSchema = z.object({
    linkType: z.string().optional(),
    linkKind: z.string().optional(),
    target: z.object({
        contextId: z.string().uuid().optional()
    }),
    tags: z.unknown().optional()
})

export const cdEventContextSchema = z.object({
    version: z.string().regex(/^\d+\.\d+\.\d+$/), // semver format
    id: z.string().uuid(),
    chainId: z.string().uuid(),
    type: z.string(),
    timestamp: z.string().datetime({ offset: true }), // ISO 8601 with timezone
    schemaUri: z.string().url(),
    links: z.array(cdEventLinkSchema).optional()
})

// Repository events
export const RepositoryCreatedEventSchema = z.object({
    context: cdEventContextSchema,
    subject: cdEventSubjectSchema
});

export const cdEventSubject = z.infer<typeof cdEventSubjectSchema>;
export const cdEventContext = z.infer<typeof cdEventContextSchema>;

export const RepositoryCreatedEvent = z.infer<typeof RepositoryCreatedEventSchema>;

// branch events

// change events