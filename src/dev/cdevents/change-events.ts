/*
    Source Control Management events -- change event types
*/
import { z } from 'zod';
import { cdEventContextSchema, cdEventSubjectSchema } from './schemas'

// A change identifies a proposed set of changes to the content of a repository
// For github, it is a PR, whilst for GitLab, it is a MR
// We only support GitHub for now. 
// Classification of sources is implemented in the adapter

const ChangeSubjectContentSchema = z.object({
    id: z.string().uuid(),
    source: z.string().url().optional(),
    type: z.literal("change").optional(),
    repository
})

// change subject content schema
const ChangeSubjectSchema = cdEventSubjectSchema.extend({
    type: z.literal("change"),

})