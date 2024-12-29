import { ValidTypes, VocabularySchema } from "../src/dev/cdevents/schemas"
// Jest tests
describe("VocabularySchema", () => {
    it("validates a correct type", () => {
        const validType = "dev.cdevents.repository.created.0.2.0";
        expect(VocabularySchema.safeParse(validType).success).toBe(true);
    });

    it("fails if the prefix is missing", () => {
        const invalidType = "repository.created.0.2.0";
        expect(VocabularySchema.safeParse(invalidType).success).toBe(false);
    });

    it("fails if the base type is invalid", () => {
        const invalidType = "dev.cdevents.branch.modified.1.0.0";
        expect(VocabularySchema.safeParse(invalidType).success).toBe(false);
    });

    it("fails if the semver is invalid", () => {
        const invalidType = "dev.cdevents.repository.created.0.2";
        expect(VocabularySchema.safeParse(invalidType).success).toBe(false);
    });

    it("fails if the semver is missing", () => {
        const invalidType = "dev.cdevents.repository.created";
        expect(VocabularySchema.safeParse(invalidType).success).toBe(false);
    });

    it("fails if the type contains extra parts", () => {
        const invalidType = "dev.cdevents.repository.created.extra.0.2.0";
        expect(VocabularySchema.safeParse(invalidType).success).toBe(false);
    });

    it("validates all valid types with valid semver", () => {
        const validSemver = "1.0.0";
    const validTypes = ValidTypes.map((baseType) => `dev.cdevents.${baseType}.${validSemver}`);
        for (const validType of validTypes) {
            expect(VocabularySchema.safeParse(validType).success).toBe(true);
        }
    });
});