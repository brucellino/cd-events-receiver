import { cdEvent, cdEventContext, cdEventSubject } from "../cdevents/schemas";

export async function handleGithubWebhook(event: string, eventId: string, payload: object) {
    const now = new Date().toISOString();
    
    // we only handle cdevent types declared in the vocabulary
    // Everything else is passthrough for now.
    switch (event) {
        case 'ping':
            return {
                zen: payload.zen
            }
        case 'repository':
            console.log(eventId);
            console.log(event);
            // The repository actions are documented at https://docs.github.com/en/webhooks/webhook-events-and-payloads#repository
            switch (event.action) {
                case 'archived':
                    console.log("repository archived")
                    return null;
                case 'created':
                    console.log("Repository created");
                    const context: cdEventContext = {
                        id: eventId,
                        version: "0.2.0",
                        timestamp: now,
                        source: payload.repository.full_name,
                        type: "repository.created",
                    };
                    const subject: cdEventSubject = {
                        id: eventId,
                        content: payload
                    }
                    const event: cdEvent = {
                        subject: subject,
                        context: context
                    };
                    return event;
                case 'deleted':
                    console.log("Repository deleted");
                case 'edited':
                    console.log("repository changed");
                case 'privatized':
                    console.log("repository changed");
                    return null;
                case 'publicized':
                    console.log("repository changed");
                    return null;
                case 'renamed':
                    console.log("repository changed");
                    return null;
                case 'transferred':
                    console.log("repository changed");
                    return null;
                case 'unarchived':
                    console.log("repository unarchived")
                    return null;
            }
        default:
            return null
        // branch.created
        // branch.deleted

        // change.created
        // change.reviewed
        // change.merged
        // change.abandoned
        // change.updated
            
    }
}