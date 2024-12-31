/* 
    Continuous Deployment Events
    Continuous Deployment (CD) events are related to continuous deployment pipelines and their target environments. These events can be emitted by environments to report where software artifacts such as services, binaries, daemons, jobs or embedded software are running.
*/

import { z } from "zod";
import { purlSchema, urlSchema } from "./types";
import { VocabularySchema } from "./schemas";
Art;

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
