/*
    Types defined in CD Events
*/

import { z } from "zod"

// Package URL
// https://github.com/package-url/purl-spec/blob/master/PURL-SPECIFICATION.rst
const componentPattern = /^[a-zA-Z0-9._-]+$/
const typeSchema = z.string().regex(componentPattern { message: "Invalid type format" });
const namespaceSchema = z.string().regex(componentPattern, { message: "Invalid namespace format" });
const nameSchema = z.string().regex(componentPattern, { message: "Invalid name format" });
const versionSchema = z.string().regex(componentPattern, { message: "Invalid version format" }).optional();
const qualifierSchema = z.record(z.string().regex(componentPattern, { message: "Invalid qualifier format" })).optional();
const subpathSchema = z.string().regex(componentPattern, { message: "Invalid subpath format" }).optional();

// create purl schema
const purlSchema = z.object({
    type: typeSchema,
    namespace: nameSchema,
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
    type: z.literal("pipelineRun"),
    pipelineName: z.string().optional(),
    url: z.string().url().optional()
})

// pipeline run started event is similar to pipelinerun queued event
const PipelineRunStartedSchema = z.object({
    id: z.string().uuid(), // 
    source: z.string().optional(), // URI Reference to source
    type: z.literal("pipelineRun"),
    pipelineName: z.string().optional(), // name of te pipeline
    url: z.string().url().optional(), // URL to the pipelineRun
})

// pipelinerun finished has an outcome and errors field
const PipelineRunFinishedSchema = z.object({
    id: z.string().uuid(),
    source: z.string().optional(),
    type: z.literal("dev.cdevents.pipelineRun.finished.0.3.0"),
    pipelineName: z.string().optional(),
    url: z.string().url().optional(),
    outcome: z.string().optional(),
    errors: z.string().optional()
})

// Exported types
// purl
export type PURL = z.infer<typeof purlSchema>;
export type PipelineRun = z.infer<typeof PipelineRunSchema>;
export type PipelineRunQueuedEvent = z.infer<typeof PipelineRunQueuedSchema>;
export type PipelineRunStartedEvent = z.infer<typeof PipelineRunStartedSchema>;
export type PipelineFinishedEvent = z.infer<typeof PipelineRunFinishedSchema>;