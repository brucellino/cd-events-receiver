/* 
    Continuous Deployment Events
    Continuous Deployment (CD) events are related to continuous deployment pipelines and their target environments. These events can be emitted by environments to report where software artifacts such as services, binaries, daemons, jobs or embedded software are running.
*/

import { z } from "zod";
import { purlSchema, urlSchema } from "./types";
import { VocabularySchema } from "./schemas";

/* 
    Subject Types
*/

export const Environment = z.object({
  id: z.string(),
  source: urlSchema,
  type: VocabularySchema,
  name: z.string(),
  url: z.string().url(),
});

export const Service = z.object({
  id: z.string(),
  source: urlSchema,
  type: VocabularySchema,
  name: z.string(),
  url: z.string().url(),
});

/* 
    Deployment Event Schemae
*/

const EnvironmentCreatedEventSchema = z.object({
  id: z.string(),
  source: urlSchema.optional(),
  type: VocabularySchema.optional(),
  name: z.string().optional(),
  url: z.string().optional(),
});

const EnvironmentModifiedEventSchema = z.object({
  id: z.string(),
  source: urlSchema.optional(),
  type: VocabularySchema.optional(),
  name: z.string().optional(),
  url: z.string().optional(),
});

const EnvironmentDeletedEventSchema = z.object({
  id: z.string(),
  source: urlSchema.optional(),
  type: VocabularySchema.optional(),
  name: z.string().optional(),
});

const ServiceDeployedEventSchema = z.object({
  id: z.string(),
  type: VocabularySchema.optional(),
  source: urlSchema.optional(),
  environment: Environment,
  artifactId: purlSchema,
});

const ServiceUpgradedEventSchema = z.object({
  id: z.string(),
  type: VocabularySchema.optional(),
  source: urlSchema.optional(),
  environment: Environment,
  artifactId: purlSchema,
});

const ServiceRolledBackEventSchema = z.object({
  id: z.string(),
  type: VocabularySchema.optional(),
  source: urlSchema.optional(),
  environment: Environment,
  artifactId: purlSchema,
});

const ServiceRemovedEventSchema = z.object({
  id: z.string(),
  type: VocabularySchema.optional(),
  source: urlSchema.optional(),
  environment: Environment,
});

const ServicePublishedEventSchema = z.object({
  id: z.string(),
  type: VocabularySchema.optional(),
  source: urlSchema.optional(),
  environment: Environment,
});

/* 
    Deployment Event Types
*/
export type EnvironmentCreated = z.infer<typeof EnvironmentCreatedEventSchema>;
export type EnvironmentModified = z.infer<typeof EnvironmentModifiedEventSchema>;
export type EnvironmentDeleted = z.infer<typeof EnvironmentDeletedEventSchema>;
export type ServiceDeployed = z.infer<typeof ServiceDeployedEventSchema>;
export type ServiceUpgraded = z.infer<typeof ServiceUpgradedEventSchema>;
export type ServiceRolledBack = z.infer<typeof ServiceRolledBackEventSchema>;
export type ServicePublished = z.infer<typeof ServicePublishedEventSchema>;
export type ServiceRemoved = z.infer<typeof ServiceRemovedEventSchema>;
