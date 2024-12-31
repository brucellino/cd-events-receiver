/* 
    Testing events covers the subjects and predicates related to test-execution performed either independently or as part of CI/CD pipelines.

*/
import { z } from "zod";
import { urlSchema } from "./types";


/* 
    testing subjects
*/

const TestCaseRunSchema = z.object({
    id: z.string(),
    source: urlSchema,
    
})