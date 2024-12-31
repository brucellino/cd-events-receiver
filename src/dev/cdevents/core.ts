import { z } from "zod";
import { VocabularySchema } from "./schemas";

// Core Types
const PipelineRunSchema = z.object({
    id: z.string().uuid(),
    source: z.string(),
    type: z.literal("pipelineRun"),
    outcome: z.string(),
    url: z.string().url(),
    errors: z.string()
});

const TaskRunSchema = z.object({
    id: z.string(),
    source: z.string(),
    type: z.literal("taskRun"),
    taskName: z.string(),
    pipelineRun: PipelineRunSchema,
    outcome: z.string(),
    url: z.string().url(),
    errors: z.string()
})

// Pipeline Events
const PipelineRunQueuedEventSchema = z.object({
    id: z.string().uuid(),
    source: z.string().url().optional(),
    // type: z.literal("dev.cdevents.pipelineRun.queued.0.3.0"),
    type: VocabularySchema.optional(),
    pipelineName: z.string().optional(),
    url: z.string().url().optional()
});

// pipeline run started event is similar to pipelinerun queued event
const PipelineRunStartedEventSchema = z.object({
    id: z.string().uuid(), // 
    source: z.string().optional(), // URI Reference to source
    type: z.literal("dev.cdevents.pipelineRun.started.0.3.0"),
    pipelineName: z.string().optional(), // name of te pipeline
    url: z.string().url().optional(), // URL to the pipelineRun
});

// pipelinerun finished has an outcome and errors field
const PipelineRunFinishedEventSchema = z.object({
    id: z.string().uuid(),
    source: z.string().optional(),
    type: z.literal("dev.cdevents.pipelineRun.finished.0.3.0"),
    pipelineName: z.string().optional(),
    url: z.string().url().optional(),
    outcome: z.enum(["success", "error", "failure"]).optional(),
    errors: z.string().optional()
});

const TaskRunStartedEventSchema = z.object({
    id: z.string(),
    source: z.string().optional(),
    type: VocabularySchema.optional(),
    taskName: z.string().optional(),
    pipelineRun: PipelineRunSchema.optional(),
    url: z.string().url().optional()
});

const TaskRunFinishedEventSchema = z.object({
    id: z.string(),
    source: z.string().optional(),
    taskName: z.string().optional(),
    pipelineRun: PipelineRunSchema.optional(),
    url: z.string().url().optional(),
    outcome: z.enum(["success", "error", "failure"]).optional(),
    errors: z.string().optional()
});


/* Core Types */
// pipeline run
export type PipelineRun = z.infer<typeof PipelineRunSchema>;
export type TaskRun = z.infer<typeof TaskRunSchema>;

/* Core Event Types */
// pipeline run queued event
export type PipelineRunQueued = z.infer<typeof PipelineRunQueuedEventSchema>;
// pipeline run started event
export type PipelineRunStarted = z.infer<typeof PipelineRunStartedEventSchema>;
// pipeline run finished event
export type PipelineFinished = z.infer<typeof PipelineRunFinishedEventSchema>;
export type TaskRunStarted = z.infer<typeof TaskRunStartedEventSchema>;
export type TaskRunFinished = z.infer<typeof TaskRunFinishedEventSchema>;
