/* 
    Continuous Integration Types
    Continuous Integration (CI) events include the subject and predicates related to CI activities such as building software, producing artifacts and running tests.
*/

import { z } from "zod";
import { VocabularySchema } from "./schemas";
import { sbomSchema, purlSchema, urlSchema } from "./types";
import { ChangeSchema } from "./scm";

/* 
 CI Types
*/

/* 
    A build is a process that uses a recipe to produce an artifact from source code.

    Note: The data model for build, apart from id and source, only includes the identifier of the artifact produced by the build. The inputs to the build process are not specified yet.
*/
const BuildSchema = z.object({
    id: z.string(),
    source: urlSchema,
    type: z.literal("build"),
    artifactId: purlSchema
});
/* 
    An artifact is usually produced as output of a build process. Events need to be generated to indicate that an artifact has been packaged and released for others to use. These events can be produced by the artifact producer or by the artifact storage system.
*/
const ArtifactSchema = z.object({
    id: z.string().describe("Example: pkg:oci/myapp@sha256%3A0b31b1c02ff458ad9b7b81cbdf8f028bd54699fa151f221d1e8de6817db93427"),
    source: z.string(),
    type: z.literal("artifact"),
    change: ChangeSchema,
    signature: z.string(),
    sbom: sbomSchema,
    user: z.string()
});

/* CI Event schemae */
const BuildQueuedEventSchema = z.object({
    id: z.string(),
    source: urlSchema.optional(),
    type: VocabularySchema.optional()
});

const BuildStartedEventSchema = z.object({
    id: z.string(),
    source: urlSchema.optional(),
    type: VocabularySchema.optional()
});

const BuildFinishedEventSchema = z.object({
    id: z.string(),
    source: urlSchema.optional(),
    type: VocabularySchema.optional(),
    artifactId: purlSchema.optional()
});

const ArtifactPackagedEventSchema = z.object({
    id: purlSchema,
    source: urlSchema.optional(),
    type: VocabularySchema.optional(),
    change: ChangeSchema,
    sbom: sbomSchema.optional()
});

const ArtifactSignedEventSchema = z.object({
    id: z.string(),
    source: urlSchema,
    type: VocabularySchema,
    signature: z.string()
});

const ArtifactPublishedEventSchema = z.object({
    id: purlSchema,
    source: urlSchema.optional(),
    type: VocabularySchema.optional(),
    user: z.string().optional()
});

const ArtifactDownloadedEventSchema = z.object({
    id: purlSchema,
    source: urlSchema.optional(),
    type: VocabularySchema.optional(),
    user: z.string().describe("The user who downloaded from the artifact registry").optional()
}).describe("The event represents an artifact that has been downloaded from the registry. The artifact downloaded event is preferably produced by the artifact registry.\n\rEvent Type: dev.cdevents.artifact.downloaded.0.1.0\n\rPredicate: downloaded\n\rSubject: artifact");

const ArtifactDeleted = z.object({
    id: purlSchema,
    source: urlSchema.optional(),
    type: VocabularySchema.optional(),
    user: z.string().optional()
});

/* CI Types */
export type Build = z.infer<typeof BuildSchema>;
export type Artifact = z.infer<typeof ArtifactSchema>;
export type BuildQueued = z.infer<typeof BuildQueuedEventSchema>;
export type BuildStarted = z.infer<typeof BuildStartedEventSchema>;
export type BuildFinished = z.infer<typeof BuildFinishedEventSchema>;
export type ArtifactPackaged = z.infer<typeof ArtifactPackagedEventSchema>;
export type ArtifactPublished = z.infer<typeof ArtifactPackagedEventSchema>;
export type ArtifactDownloaded = z.infer<typeof ArtifactDownloadedEventSchema>;
export type ArtifactDeleted = z.infer<typeof ArtifactDownloadedEventSchema>;
