import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
import { decodeBase64 } from 'hono/utils/encode'

type Bindings = {
  KV: KVNamespace
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
  GITHUB_CALLBACK_URL: string
}

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/', (c) => {
  return c.html('<html><head><link rel = "stylesheet" href = "https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"></head><body><header class="container-fluid"><h3>CD Events Receiver</h3></header></body></html>')
})

app.notFound((c) => {
  return c.text('Sorry, can\'t find that mate', 404)
})


// /login is the path which redirects to the github auth login
app.get('/login', (c) => {
  const clientId = c.env.GITHUB_CLIENT_ID
  const callbackUrl = c.env.GITHUB_CALLBACK_URL
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=read:user`;
  return c.redirect(githubAuthUrl)
});

// callback path is what the authorised user will be sent back to.
app.get('/callback', async (c) => {
  const clientId = c.env.GITHUB_CLIENT_ID;
  const clientSecret = c.env.GITHUB_CLIENT_SECRET;
  const code = c.req.query('code');
  
  if (!code) return c.text('Authorisation code missing', 400)
  
  // exchange the code for an access token
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  })
  
  const data = await response.json();
  if (!data.access_token) return c.text('Failed to fetch access token', 400)
  
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-Github-Api-Version': '2022-11-28',
      Authorization: `Bearer ${data.access_token}`,
      'User-Agent': 'Cloudflare'
    },
  });
  const userData = await userResponse.json();
  console.log(userData);
  
  return c.html(`<html><body>Hello ${userData.login}</body></html>`)
})

// A protected route
app.get('/protected', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.text('Unauthorized', 401);

  try {
    const token = authHeader.replace('Bearer ', '');
    const { header, payload } = decode(token)
    console.log(header)
    console.log(payload)
    // const user = decodeJwt(token); // Decode the JWT token
    return c.json({ message: 'Protected content', payload });
  } catch {
    return c.text('Invalid token', 401);
  }
});


export default app;