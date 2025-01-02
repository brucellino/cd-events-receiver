// routing for Github events
import { Hono } from "hono";
import { verify } from "@octokit/webhooks-methods";
import { handleGithubRepositoryWebhook } from "../dev/cdevents/transformToCdEvents";
import { BranchProtectionSchema, GithubRepository, RepositoryPayloadSchema } from "../dev/cdevents/github-types";
import { z } from "zod";
import { cdEvent, cdEventContext, cdEventSubject, cdEventSubjectSchema, VocabularySchema } from "../dev/cdevents/schemas";
import { components } from "@octokit/openapi-webhooks-types";
type Bindings = {
  GITHUB_WEBHOOK_SECRET: string;
};

// Cast into relevant object based on event
// These should be a cdevents or cdeventsX Type, but we will fix that later.
const known_type_prefix: string = "dev.cdevents";
const custom_type_prefix: string = "dev.cdventsx";
const tool: string = "github";
const version: string = "0.1.0";
const githubWebhook = new Hono<{ Bindings: Bindings }>();


// If people do gets on our api, we don't care, just tell them everything is fine.
githubWebhook.get("/", async (c) => {
  return c.json({"OK": true}, 200)
})

// Route for the Github hook receive url
// All webhooks are received on this url.
// It can be mounted on a different root.
githubWebhook.post("/", async (c) => {
  // first, we validate the signature.
  // If the signature is invalid, reject the event
  const signature = c.req.header("X-Hub-Signature-256");
  const body = await c.req.text();
  const secret = c.env.GITHUB_WEBHOOK_SECRET;
  // validate the signature in the header
  const isValid = await verify(secret, body, signature || "");
  if (!isValid) {
    return c.text("Invalid webhook signature", 401);
  }

  // The event type and event Id are in the relevant headers.
  const event = String(c.req.header("X-Github-Event"));
  const eventId = String(c.req.header("X-Github-Delivery"));
  const content = JSON.parse(body);
  // pass to function which will create contextual event
  // let payload;
  let prefix: string = "";
  let subject: string = "";
  let type: string = "";
  let predicate = "action" in content ? "" : "custom";
  switch (event) {
    /* See https://docs.github.com/en/webhooks/webhook-events-and-payloads
    */
    // First we deal with unsupported event types
    // We keep these events explicit so that we can set the cdeventsx type
    // If the event is custom, we assign the subject to the event time.
    // else it is assigned a subject as part of the cd event vocabulary.
    case "branch_protection_configuration":
    case "branch_protection_rule":
    // case: "check_run" // <- test case run
    // case: "check_suite" // <- test suite run
    case "code_scanning_alert":
    case "commit_comment":
    case "custom_property":
    case "custom_property_values":
    // case "dependabot_alert" // <- ops.ticket
    case "deploy_key":
    // case "deployment": // <- service or environment
    // case "deployment_protection_rule": // <- environment.modified
    case "deployment_review":
    // case "deployment_status": // <- service
    case "discussion":
    case "discussion_comment":
    case "fork":
    case "github_app_authorization":
    case "gollum":
    case "installation":
    case "installation_repositories":
    case "installation_target":
    case "label":
    case "marketplace_purchase":
    case "member":
    case "membership":
    case "merge_group":
    case "meta":
    case "milestone":
    case "org_block":
    case "organization":
    // case "package": // <- artifact.
    case "page_build":
    case "personal_access_token_request":
    case "ping":
    // case "project_card": // <-- ticket
    case "project":
    case "project_column":
    case "projects_v2":
    // case "projects_v2_item": // <-- ticket
    case "projects_v2_status_update":
    // case "public": // <- repository.changed
    // case "pull_request": // change
    // case "pull_request_review_comment": // change
    // case "pull_request_review": // change
    // case "pull_request_review_thread": // change
    // case "push": // branch.modified
    // case "registry_package": // artifact
    // case "release": // artifact
    // case "repository_advisory": // incident
    case "repository_dispatch":
    case "repository_import":
    case "repository_ruleset":
    // case "repository_vulnerability_alert": // incident
    // case "secret_scanning_alert": // incident
    case "secret_scanning_alert_location":
    case "secret_scanning_scan":
    case "security_advisory":
    case "security_and_analysis":
    case "sponsorship":
    case "star":
    case "status":
    case "sub_issues":
    case "team_add":
    case "team":
    case "watch":
    // case "workflow_dispatch": // pipelinerun.queued
    // case "workflow_job": // taskrun
    // case "workflow_run": // pipelinerun
      prefix = custom_type_prefix;
      subject = event;
    
    /* 
      Now, defined events in the vocabulary
      We start with SCM events : 
        Repository, Branch and Change
    */
    case "repository":
      prefix = known_type_prefix;
      subject = "repository";
      switch (content.action) {
        case "archived":
        case "privatized":
        case "modified":
        case "publicized":
        case "renamed":
        case "transferred":
        case "unarchived":
          predicate = "modified"
        case "created":
        case "deleted":
          predicate = content.action
      }
    case "create": // <- branch create
      if (content.ref_type == "branch") {
        prefix = known_type_prefix;
        subject = "branch"
        predicate = "created"
      } else {
        prefix = custom_type_prefix;
        subject = "ref"
        predicate = "created";
      }
    case "delete": // <- branch or ref delete see https://docs.github.com/en/webhooks/webhook-events-and-payloads#delete
      if (content.ref_type == "branch") {
        prefix = known_type_prefix;
        subject = "branch"
        predicate = "deleted"
      } else {
        prefix = custom_type_prefix;
        subject = "ref"
        predicate = "deleted";
      }
    case "issues": // <- ticket
      prefix = known_type_prefix;
      subject = "ticket"
      switch (content.action) {
        case "opened":
          predicate = "created"
        case "deleted":
        case "locked":
        case "closed":
          predicate = "closed"
        default:
          predicate = "modified";
      }
    case "issue_comment": // <- ticket.updated
      prefix = known_type_prefix;
      subject = "ticket"
      predicate = "updated"
    default:
      prefix = custom_type_prefix;
      subject = "unknown";
  }
  type = `${prefix}.${tool}-${subject}.${predicate}.${version}`;  
  const now = new Date().toISOString();
  // Transform and handle the event
  // First we need to implement the cdEvent Type
  const eventSubject: cdEventSubject = {
    id: eventId,
    content: content,
    source: "github",
    type: type
  }

  const eventContext: cdEventContext = {
    id: eventId,
    type: type,
    source: "github",
    timestamp: now,
    version: version,
  }
  
  const EventData: cdEvent = {
    subject: eventSubject,
    context: eventContext,
  }
  
  try {
    
  } catch (error) {
    console.log("there was an error handling the webhook");
  }
  console.log(e);
  // put on the queue

  if (!e) return c.text("Event Type Not supported", 422);

  return c.json(e, 201);
});

export default githubWebhook;
