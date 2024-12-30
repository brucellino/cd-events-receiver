/*
    Types defined in CD Events
*/

import { z } from "zod"
import { VocabularySchema } from "../cdevents/schemas"
// Package URL
// https://github.com/package-url/purl-spec/blob/master/PURL-SPECIFICATION.rst
const componentPattern = /^[a-zA-Z0-9._-]+$/
const urlWithProtocolPattern = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^\s/$.?#].[^\s]*$/;
const urlSchema = z.string().regex(urlWithProtocolPattern, {
    message: "Invalid URL format. A protocol (e.g., https, git) is required.",
});
const typeSchema = z.string().regex(componentPattern { message: "Invalid type format" });
const namespaceSchema = z.string().regex(componentPattern, { message: "Invalid namespace format" });
const nameSchema = z.string().regex(componentPattern, { message: "Invalid name format" });
const versionSchema = z.string().regex(componentPattern, { message: "Invalid version format" }).optional();
const qualifierSchema = z.record(z.string().regex(componentPattern, { message: "Invalid qualifier format" })).optional();
const subpathSchema = z.string().regex(componentPattern, { message: "Invalid subpath format" }).optional();

// create purl schema
const purlSchema = z.object({
    type: typeSchema,
    namespace: namespaceSchema,
    name: nameSchema,
    version: versionSchema,
    qualifiers: z.array(qualifierSchema),
    subpath: subpathSchema

})

// Core Types
const PipelineRunSchema = z.object({
    id: z.string().uuid(),
    source: z.string(),
    type: z.literal("pipelineRun"),
    outcome: z.string(),
    url: z.string().url(),
    errors: z.string()
});

// Pipeline Events
const PipelineRunQueuedSchema = z.object({
    id: z.string().uuid(),
    source: z.string().url().optional(),
    // type: z.literal("dev.cdevents.pipelineRun.queued.0.3.0"),
    type: 
    pipelineName: z.string().optional(),
    url: z.string().url().optional()
});

// pipeline run started event is similar to pipelinerun queued event
const PipelineRunStartedSchema = z.object({
    id: z.string().uuid(), // 
    source: z.string().optional(), // URI Reference to source
    type: z.literal("dev.cdevents.pipelineRun.started.0.3.0"),
    pipelineName: z.string().optional(), // name of te pipeline
    url: z.string().url().optional(), // URL to the pipelineRun
});

// pipelinerun finished has an outcome and errors field
const PipelineRunFinishedSchema = z.object({
    id: z.string().uuid(),
    source: z.string().optional(),
    type: z.literal("dev.cdevents.pipelineRun.finished.0.3.0"),
    pipelineName: z.string().optional(),
    url: z.string().url().optional(),
    outcome: z.string().optional(),
    errors: z.string().optional()
});

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
const ChangeSchema = z.object({
    id: z.string(),
    source: z.string(),
    type: z.literal("change"),
    description: z.string(),
    repository: RepositorySchema,
})

/* SCM Events */
// const RepositoryCreatedEventSchema // <- in repository-events.ts
// const RepositoryModifiedEventSchema // <- in repository-events.ts
// const RepositoryDeletedEventSchema // <- in repository-events.ts

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

// Exported types
// purl
export type PURL = z.infer<typeof purlSchema>;
/* Core Types */
// pipeline run
export type PipelineRun = z.infer<typeof PipelineRunSchema>;
// pipeline run queued event
export type PipelineRunQueuedEvent = z.infer<typeof PipelineRunQueuedSchema>;
// pipeline run started event
export type PipelineRunStartedEvent = z.infer<typeof PipelineRunStartedSchema>;
// pipeline run finished event
export type PipelineFinishedEvent = z.infer<typeof PipelineRunFinishedSchema>;

/* SCM types */
export type Repository = z.infer<typeof RepositorySchema>;
export type Branch = z.infer<typeof BranchSchema>;
export type Change = z.infer<typeof ChangeSchema>;

/* SCM Event Types */
export type BranchCreated = z.infer<typeof BranchCreatedEventSchema>;
export type BranchDeleted = z.infer<typeof BranchDeletedEventSchema>;
export type ChangeCreated = z.infer<typeof ChangeCreatedEventSchema>;
export type ChangeReviewed = z.infer<typeof ChangeReviewedEventSchema>;
export type ChangeMerged = z.infer<typeof ChangeMergedEventSchema>;
export type ChangeAbandoned = z.infer<typeof ChangeAbandonedEventSchema>;
export type ChangeUpdated = z.infer<typeof ChangeUpdatedEventSchema>;