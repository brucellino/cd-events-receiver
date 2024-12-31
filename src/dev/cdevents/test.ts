/* 
    Testing events covers the subjects and predicates related to test-execution performed either independently or as part of CI/CD pipelines.

*/
import { z } from "zod";
import { urlSchema } from "./types";
import { Environment } from "./cd";

/* Common Objects */
const Trigger = z.object({
    type: z.enum(["manual", "pipeline", "event", "schedule", "other"]),
    uri: urlSchema.optional()
});

const TestCase = z.object({
    id: z.string(),
    type: z.enum(["performance", "functional", "unit", "security", "compliance", "integration", "e2e", "other"]).optional(),
    name: z.string().optional(),
    version: z.string().optional(), // should be semver
    uri: urlSchema.optional()
});

const TestSuite = z.object({
    id: z.string(),
    name: z.string().optional(),
    version: z.string().optional(), // should be semver
    uri: urlSchema.optional()
});


/* 
    testing subjects
*/

const TestSuiteRun = z.object({
    id: z.string(),
    source: urlSchema.optional(),
    environment: Environment.optional(),
    testSuite: TestSuite.optional()
});

const TestCaseRun = z.object({
    id: z.string(),
    source: urlSchema.optional(),
    environment: Environment.optional(),
    testCase: TestCase.optional(),
    testSuiteRun: TestSuiteRun.optional()
});

const TestOutput = z.object({
    id: z.string(),
    source: urlSchema,
    outputType: z.enum(["video", "image", "log", "report", "other"]);
    format: z.string(),
    uri: z.string().url(),
    testCaseRun: TestCaseRun
})

/* 
    Testing Event Schemae
*/

const TestCaseRunQueuedEventSchema = z.object({
    id: z.string(),
    source: urlSchema.optional(),
    environment: Environment,
    testCase: TestCase.optional(),
    testSuiteRun: TestSuiteRun.optional(),
    trigger: Trigger.optional()
});

const TestCaseRunStartedEventSchema = z.object({
    id: z.string(),
    source: urlSchema.optional(),
    environment: Environment,
    testCase: TestCase.optional(),
    testSuiteRun: TestSuiteRun.optional(),
    trigger: Trigger.optional()
});

const TestCaseRunFinishedEventSchema = z.object({
    id: z.string(),
    source: urlSchema.optional(),
    environment: Environment,
    testCase: TestCase.optional(),
    testSuiteRun: TestSuiteRun.optional(),
    outcome: z.enum(["pass", "fail", "cancel", "error"]),
    severity: z.enum(["low", "medium", "high", "critical"]),
    reason: z.string()
});

const TestCaseRunSkippedEventSchema = z.object({
    id: z.string(),
    source: urlSchema.optional(),
    environment: Environment,
    testCase: TestCase.optional(),
    testSuiteRun: TestSuiteRun.optional(),
    outcome: z.enum(["pass", "fail", "cancel", "error"]),
    severity: z.enum(["low", "medium", "high", "critical"]),
    reason: z.string()
});

const TestSuiteRunQueuedEventSchema = z.object({
    id: z.string(),
    source: urlSchema.optional(),
    environment: Environment,
    testSuite: TestSuite.optional(),
    trigger: Trigger.optional()
});

const TestSuiteRunStartedEventSchema = z.object({
    id: z.string(),
    source: urlSchema.optional(),
    environment: Environment,
    testCase: TestCase.optional(),
    trigger: Trigger.optional()
});

const TestSuiteRunFinishedEventSchema = z.object({
    id: z.string(),
    source: urlSchema.optional(),
    environment: Environment,
    testCase: TestCase.optional(),
    testSuiteRun: TestSuiteRun.optional(),
    outcome: z.enum(["pass", "fail", "cancel", "error"]),
    severity: z.enum(["low", "medium", "high", "critical"]),
    reason: z.string()
});

const TestSuiteRunSkippedEventSchema = z.object({
    id: z.string(),
    source: urlSchema.optional(),
    environment: Environment,
    testCase: TestCase.optional(),
    testSuiteRun: TestSuiteRun.optional(),
    severity: z.enum(["low", "medium", "high", "critical"]),
    reason: z.string()
});

const TestSuiteRunPublishedEventSchema = z.object({
    id: z.string(),
    source: urlSchema,
    outputType: z.enum(["report", "video", "image", "log", "other"]),
    format: z.string(),
    uri: urlSchema.optional(),
    testCaseRun: TestCaseRun.optional()
});

/* event types */
export type TestSuiteRun = z.infer<typeof TestSuiteRun>;
export type TestCaseRun = z.infer<typeof TestCaseRun>;
export type TestCaseRunStarted = z.infer<typeof TestCaseRunStartedEventSchema>;
export type TestCaseRunQueued = z.infer<typeof TestCaseRunQueuedEventSchema>;
export type TestCaseRunFinished = z.infer<typeof TestCaseRunFinishedEventSchema>;
export type TestCaseRunSkipped = z.infer<typeof TestCaseRunQueuedEventSchema>;
export type TestSuiteRunQueued = z.infer<typeof TestSuiteRunQueuedEventSchema>;
export type TestSuiteRunStartedEventSchema = z.infer<typeof TestSuiteRunQueuedEventSchema>;
export type TestSuiteRunFinished = z.infer<typeof TestSuiteRunFinishedEventSchema>;
