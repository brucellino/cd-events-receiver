import { z } from 'zod';
/* 
    Some types need to be created from CloudEvents: https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#type-system
    Also cdevent types: 
    https://github.com/cdevents/spec/blob/v0.4.1/spec.md#types

    Object key names are by conventioned defined in CamelCase
*/

export const cdEventLinkSchema = z.object({
    linkType: z.string().optional(),
    linkKind: z.string().optional(),
    target: z.object({
        contextId: z.string().uuid().optional()
    }),
    tags: z.unknown().optional()
});

export const cdEventSubjectSchema = z.object({
    id: z.string(),
    content: z.unknown(),
    source: z.string().optional(),
    type: z.string().optional(),
});

export const cdEventContextSchema = z.object({
    id: z.string().uuid(),
    type: z.string(),
    source: z.string().url(),
    version: z.string().regex(/^\d+\.\d+\.\d+$/), // semver format
    timestamp: z.string().datetime({ offset: true }), // ISO 8601 with timezone
    chainId: z.string().uuid(),
    schemaUri: z.string().url(),
    links: z.array(cdEventLinkSchema).optional()
});
