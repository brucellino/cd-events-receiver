import { z } from 'zod';

import { cdEventContextSchema, cdEventSubjectSchema } from './schemas'
import { cdEventContext } from './scm';


// repository subject content schema
const RepositorySubjectContentSchema = z.object({
    name: z.string(),
    url: z.string().url()
});

// repository subject schema
export const RepositorySubjectSchema = cdEventSubjectSchema.extend({
    type: z.literal("repository"),
    content: RepositorySubjectContentSchema,
});

// Repository Events
export const RepositoryCreatedEventSchema = cdEventContextSchema.extend({
    type: z.literal("dev.cdevents.repository.created"),
    subject: RepositorySubjectContentSchema
});

export const RepositoryModifiedEventSchema = cdEventContextSchema.extend({
    type: z.literal("dev.cdvents.repository.modified"),
    subject: RepositorySubjectSchema
});

export const RepositoryDeletedEventSchema = cdEventContextSchema.extend({
    type: z.literal("dev.cdevents.repository.deleted"),
    subject: RepositorySubjectSchema
});

// Export the types

export type RepositoryCreatedEvent = z.infer<typeof RepositoryCreatedEventSchema>;
export type RepositoryModifiedEvent = z.infer<typeof RepositoryModifiedEventSchema>;
export type RepositoryDeletedEvent = z.infer<typeof RepositoryDeletedEventSchema>;