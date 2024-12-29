import { RepositoryCreatedEventSchema, RepositoryModifiedEventSchema, RepositoryDeletedEventSchema } from "../src/dev/cdevents/repository-events";

describe("Repository Event Schemas", () => {
    const validBaseEvent = {
        context: {
            version: "0.2.0",
            id: "12345",
            source: "https://github.com",
            timestamp: new Date().toISOString(),
            links: [],
            type: "dev.cdevents.repository.created",
        },
        subject: {
            id: "repo-1",
            source: "github.com",
            type: "repository",
            content: {
                name: "my-repo",
                url: "https://github.com/me/my-repo"
            },
        },
    };

    test("validates a RepositoryCreated event", () => {
        const event = validBaseEvent;
        console.log(event)
        const result = RepositoryCreatedEventSchema.safeParse(event);
        console.log(result)
        expect(result.success).toBe(true);
    })
})