// routing for Github events
import { Hono } from 'hono';
import { verify } from '@octokit/webhooks-methods'
import '../dev/cdevents/transformToCdEvents'
import { handleGithubWebhook } from '../dev/cdevents/transformToCdEvents';
import { cdEvent } from '../dev/cdevents/schemas';
type Bindings = {
    GITHUB_WEBHOOK_SECRET: string
}

const githubWebhook = new Hono<{ Bindings: Bindings }>();

// Github hook receive url
githubWebhook.post('/', async (c) => {
    const signature = c.req.header('X-Hub-Signature-256');
    const body = await c.req.text();
    const secret = c.env.GITHUB_WEBHOOK_SECRET;
    // validate the signature in the header
    const isValid = await verify(secret, body, signature || '');
    if (!isValid) {
        return c.text('Invalid webhook signature', 401);
    }

    // parse the event payload.
    // The event type and event Id are in the relevant headers.
    const event = String(c.req.header('X-Github-Event'));
    const eventId = String(c.req.header('X-Github-Delivery'));
    const payload = JSON.parse(body);
    // Transform and handle the event
    // First we need to implement the cdEvent Type
    let e = null;
    try {
        e = await handleGithubWebhook(event, eventId, payload); // -> should return a cd event with context and subject
        console.log(e)
    } catch (error) {
        return c.text('Unsupported Event', 422);
    }
    console.log(e);    
    // put on the queue
    return c.json("OK", 201);
})

export default githubWebhook