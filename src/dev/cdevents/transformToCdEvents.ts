import { cdEvent, cdEventContext, cdEventSubject } from "../cdevents/schemas";

export async function handleGithubWebhook(
  event: string,
  eventId: string,
  payload: object
) {
  const now = new Date().toISOString();

  // we only handle cdevent types declared in the vocabulary
  // Everything else is passthrough for now.
  switch (event) {
    case "ping":
      return false;
    case "repository":
      console.log(eventId);
      console.log(event);
      // The repository actions are documented at https://docs.github.com/en/webhooks/webhook-events-and-payloads#repository
      switch (payload.action) {
        case "archived":
          console.log("repository archived");
          return false;
        case "created":
          console.log("Repository created");
          publishCdEvent(eventId, event, payload);
          return true;
        case "deleted":
          console.log("Repository deleted");
        case "edited":
          console.log("repository changed");
        case "privatized":
          console.log("repository changed");
          return null;
        case "publicized":
          console.log("repository changed");
          return null;
        case "renamed":
          console.log("repository changed");
          return null;
        case "transferred":
          console.log("repository changed");
          return null;
        case "unarchived":
          console.log("repository unarchived");
          return null;
      }
    default:
      return null;
    // branch.created
    // branch.deleted

    // change.created
    // change.reviewed
    // change.merged
    // change.abandoned
    // change.updated
  }
}

async function publishCdEvent(event: string, eventId: string, payload: object) { 
    return null;
};
