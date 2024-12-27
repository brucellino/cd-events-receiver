import { z } from 'zod';

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
