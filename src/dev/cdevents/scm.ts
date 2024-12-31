import { z } from 'zod';
import { VocabularySchema } from './schemas';
import { urlSchema } from './types';
/*
    Repository.
    An SCM repository is identified by a name, an owner which can be a user or an organization, a url which is where the repository is hosted and optionally a viewUrl, which is a web location for humans to browse the content of the repository.
*/
const RepositorySchema = z.object({
    id: z.string().uuid(),
    source: z.string(),
    type: z.literal("repository"),
    name: z.string(),
    owner: z.string(),
    url: urlSchema, // url for API operations. Needs to include protocol
    viewUrl: z.string().url()
})

/* SCM branch. Identified by ID
*/
const BranchSchema = z.object({
    id: z.string(),
    source: z.string(),
    type: z.literal("branch"),
    repository: RepositorySchema
})

/* SCM Change */
export const ChangeSchema = z.object({
    id: z.string(),
    source: z.string(),
    type: z.literal("change"),
    description: z.string().optional(),
    repository: RepositorySchema.optional(),
})

/* SCM Events */
const RepositoryCreatedEventSchema = z.object({
    id: z.string(),
    source: z.string().optional(),
    type: VocabularySchema.optional(),
    name: z.string(),
    owner: z.string(),
    url: urlSchema,
    viewUrl: z.string().url().optional()
})
const RepositoryModifiedEventSchema = z.object({
    id: z.string(),
    source: z.string().optional(),
    type: VocabularySchema.optional(),
    name: z.string(),
    owner: z.string().optional(),
    url: urlSchema,
    viewUrl: z.string().url().optional()
})

const RepositoryDeletedEventSchema = z.object({
    id: z.string(),
    source: z.string().optional(),
    type: VocabularySchema.optional(),
    name: z.string().optional(),
    owner: z.string().optional(),
    url: urlSchema.optional(),
    viewUrl: z.string().url()
})

// Branch Events
const BranchCreatedEventSchema = z.object({
    id: z.string(),
    source: z.string().optional(),
    type: VocabularySchema.optional(),
    repository: RepositorySchema.optional()
});

const BranchDeletedEventSchema = z.object({
    id: z.string(),
    source: z.string().optional(),
    type: VocabularySchema.optional(),
    repository: RepositorySchema.optional()
});

// Change Events
const ChangeCreatedEventSchema = z.object({
    id: z.string(),
    source: z.string().optional(),
    type: VocabularySchema.optional(),
    description: z.string(),
    repository: RepositorySchema.optional()
});

const ChangeReviewedEventSchema = z.object({
    id: z.string(),
    source: z.string().optional(),
    type: VocabularySchema.optional(),
    repository: RepositorySchema
});

const ChangeMergedEventSchema = z.object({
    id: z.string(),
    source: z.string().optional(),
    type: VocabularySchema.optional(),
    repository: RepositorySchema.optional()
});

const ChangeAbandonedEventSchema = z.object({
    id: z.string(),
    source: z.string().optional(),
    type: VocabularySchema.optional(),
    repository: RepositorySchema.optional()
});

const ChangeUpdatedEventSchema = z.object({
    id: z.string(),
    source: z.string().optional(),
    type: VocabularySchema.optional(),
    repository: RepositorySchema.optional()
})


/* SCM types */
export type Repository = z.infer<typeof RepositorySchema>;
export type Branch = z.infer<typeof BranchSchema>;
export type Change = z.infer<typeof ChangeSchema>;

/* SCM Event Types */
export type RepositoryCreated = z.infer<typeof RepositoryCreatedEventSchema>;
export type RepositoryModified = z.infer<typeof RepositoryModifiedEventSchema>;
export type RepositoryDeleted = z.infer<typeof RepositoryDeletedEventSchema>;
export type BranchCreated = z.infer<typeof BranchCreatedEventSchema>;
export type BranchDeleted = z.infer<typeof BranchDeletedEventSchema>;
export type ChangeCreated = z.infer<typeof ChangeCreatedEventSchema>;
export type ChangeReviewed = z.infer<typeof ChangeReviewedEventSchema>;
export type ChangeMerged = z.infer<typeof ChangeMergedEventSchema>;
export type ChangeAbandoned = z.infer<typeof ChangeAbandonedEventSchema>;
export type ChangeUpdated = z.infer<typeof ChangeUpdatedEventSchema>;
