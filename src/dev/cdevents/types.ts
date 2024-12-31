/*
    Types defined in CD Events
*/

import { z } from "zod"

// Package URL
// https://github.com/package-url/purl-spec/blob/master/PURL-SPECIFICATION.rst
const componentPattern = /^[a-zA-Z0-9._-]+$/
const urlWithProtocolPattern = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^\s/$.?#].[^\s]*$/;
export const urlSchema = z.string().regex(urlWithProtocolPattern, {
    message: "Invalid URL format. A protocol (e.g., https, git) is required.",
});
const typeSchema = z.string().regex(componentPattern, { message: "Invalid type format" });
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

// Exported types
// purl
export type PURL = z.infer<typeof purlSchema>;