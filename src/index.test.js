import { describe, expect, test } from '@jest/globals';
import { app } from 'index';
describe('Root', () => {
    test('GET /'), async () => {
        const req = new Request("http://localhost:8787/", {
          method: "GET",
        });
        const res = await app.request(req)
        expect (res.status).toBe(200)
    }
})