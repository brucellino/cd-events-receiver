import { z } from "zod";
/* 
    Some types need to be created from CloudEvents: https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md#type-system
    Also cdevent types: 
    https://github.com/cdevents/spec/blob/v0.4.1/spec.md#types

    Object key names are by convention defined in CamelCase
*/

const semVerRegex = /^[0-9]+\.[0-9]+\.[0-9]+$/;

// Define vocabulary using Zod.
// For more on the vocabulary see https://github.com/cdevents/spec/blob/v0.4.1/spec.md#vocabulary
const vocabulary = {
    core: {
        pipelineRun: ["queued", "started", "finished"],
        taskRun: ["started", "finished"]
    },
    scm: {
        repository: ["created", "modified", "deleted"],
        branch: ["created", "deleted"],
        change: ["created", "reviewed", "merged", "abandoned", "updated"]
    },
};

// Generate the valid types based on the vocabulary
export const ValidTypes = Object.entries(vocabulary.scm).flatMap(([key, actions]) =>
    actions.map((action) => `${key}.${action}`)
);

// Create Zod Schema for valid types
// const VocabularySchema = z.enum(validTypes as [string, ...string[]]);
export const VocabularySchema = z.string().refine((value) => {
    
    // ensure that type starts with "dev.cdevents"
    if (!value.startsWith("dev.cdevents")) return false;

    // Remove the prefix and split the rest of the string into parts which we validate independently.

    const rest = value.slice("dev.cdevents.".length); // the length of the rest of the string
    const parts = rest.split("."); // string is separated by dots
    const baseType = parts.slice(0, -3).join("."); // everything before the semver
    const semver = parts.slice(-3).join("."); // last 3 parts as semver

    // It must match one of the base types (subject.predicate) and the semver
    return ValidTypes.includes(baseType) && semVerRegex.test(semver)
}, {
    message: `Invalid event type. Must be in the form of "dev.cdevents.<subject>.<predicate>.<semver>"`
});

export const cdEventLinkSchema = z.object({
  linkType: z.string().optional(),
  linkKind: z.string().optional(),
  target: z.object({
    contextId: z.string().uuid().optional(),
  }),
  tags: z.unknown().optional(),
});

export const cdEventContextSchema = z.object({
  id: z.string().uuid(), //
  type: VocabularySchema,
  source: z.string().url(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/), // semver format
  timestamp: z.string().datetime({ offset: true }), // ISO 8601 with timezone
  chainId: z.string().uuid(),
  schemaUri: z.string().url(),
  links: z.array(cdEventLinkSchema).optional(),
});

export const cdEventSubjectSchema = z.object({
  id: z.string(),
  content: z.unknown(),
  source: z.string().optional(),
  type: z.string().optional(),
});
