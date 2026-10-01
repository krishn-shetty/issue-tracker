// End-to-end API smoke test. Run after `npm run seed` with the server running:  npm run smoke
const BASE = process.env.API_URL || 'http://localhost:5000/api/v1';
const MISSING_ID = '000000000000000000000000';

class Client {
  cookie = '';
  async req(method, path, body, headers = {}) {
    const res = await fetch(BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(this.cookie && { Cookie: this.cookie }), ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    for (const c of res.headers.getSetCookie?.() ?? []) {
      const pair = c.split(';')[0];
      if (pair.startsWith('token=')) this.cookie = pair === 'token=' ? '' : pair;
    }
    let json = null;
    try { json = await res.json(); } catch { /* no body */ }
    return { status: res.status, body: json, headers: res.headers };
  }
}

let failed = 0;
const check = (name, cond, extra = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : '  ' + extra}`);
  if (!cond) failed++;
};
const login = async (email, password) => {
  const c = new Client();
  const r = await c.req('POST', '/auth/login', { email, password });
  if (r.status !== 200) throw new Error(`login failed for ${email}: ${r.status}`);
  return { c, user: r.body.data };
};

const anon = new Client();
let r = await anon.req('GET', '/issues');
check('anonymous GET /issues -> 401', r.status === 401);
r = await anon.req('GET', '/dashboard/summary');
check('anonymous dashboard -> 401', r.status === 401);
r = await anon.req('GET', '/auth/me', undefined, { Cookie: 'token=garbage' });
check('invalid token -> 401', r.status === 401);

// ---- auth
r = await anon.req('POST', '/auth/register', { name: 'X', email: 'bad', password: '1' });
check('register invalid body -> 422', r.status === 422);
r = await anon.req('POST', '/auth/register', { name: 'Dup', email: 'admin@example.com', password: 'Passw0rd1' });
check('register duplicate email -> 409', r.status === 409);
const email = `smoke${Date.now()}@example.com`;
const fresh = new Client();
r = await fresh.req('POST', '/auth/register', { name: 'Smoke User', email, password: 'Passw0rd1', role: 'ADMIN' });
check('register -> 201, role forced to USER', r.status === 201 && r.body.data.role === 'USER', JSON.stringify(r.body));
check('register response has no password', !JSON.stringify(r.body).includes('password'));
const setCookie = r.headers.getSetCookie().join(';');
check('cookie is HttpOnly', /HttpOnly/i.test(setCookie));
check('JWT not in response body', !JSON.stringify(r.body).includes('eyJ'));
r = await fresh.req('GET', '/auth/me');
check('GET /auth/me -> 200', r.status === 200 && r.body.data.email === email);
r = await anon.req('POST', '/auth/login', { email, password: 'wrongpass1' });
check('wrong password -> 401', r.status === 401);
r = await anon.req('POST', '/auth/login', { email: { $ne: null }, password: { $ne: null } });
check('NoSQL operator login payload -> 422', r.status === 422);
r = await fresh.req('POST', '/auth/logout');
check('logout -> 200', r.status === 200);
r = await fresh.req('GET', '/auth/me');
check('/auth/me after logout -> 401', r.status === 401);

const admin = await login('admin@example.com', 'Admin@123');
const rahul = await login('rahul@example.com', 'User@123');
const anil = await login('anil@example.com', 'User@123');
const john = await login('john@example.com', 'User@123');

// ---- users
r = await rahul.c.req('GET', '/users');
check('GET /users -> 200 with no passwords', r.status === 200 && r.body.data.length >= 4 && !JSON.stringify(r.body).includes('password'));
r = await rahul.c.req('GET', `/users/${anil.user.id}`);
check('GET /users/:id -> 200', r.status === 200 && r.body.data.id === anil.user.id);
r = await rahul.c.req('GET', '/users/not-an-id');
check('GET /users/invalid -> 422', r.status === 422);
r = await rahul.c.req('GET', `/users/${MISSING_ID}`);
check('GET /users/missing -> 404', r.status === 404);

// ---- issues
r = await rahul.c.req('POST', '/issues', { title: 'ab', description: '' });
check('create issue invalid -> 422', r.status === 422);
r = await rahul.c.req('POST', '/issues', { title: 'Smoke test issue', description: 'Created by smoke test', priority: 'HIGH' });
check('create issue -> 201 (defaults OPEN)', r.status === 201 && r.body.data.status === 'OPEN' && r.body.data.createdBy.id === rahul.user.id, JSON.stringify(r.body));
const issueId = r.body.data.id;
r = await rahul.c.req('POST', '/issues', { title: 'Bad assignee', description: 'x', assignedTo: MISSING_ID });
check('create with missing assignee -> 422', r.status === 422);
r = await rahul.c.req('GET', `/issues/${issueId}`);
check('get issue -> 200', r.status === 200 && r.body.data.id === issueId);
r = await rahul.c.req('GET', '/issues/xyz');
check('get issue invalid id -> 422', r.status === 422);
r = await rahul.c.req('GET', `/issues/${MISSING_ID}`);
check('get missing issue -> 404', r.status === 404);

r = await rahul.c.req('GET', '/issues?page=1&limit=3');
check('list paginated', r.status === 200 && r.body.data.length <= 3 && r.body.pagination.limit === 3 && r.body.pagination.total >= 9, JSON.stringify(r.body.pagination));
r = await rahul.c.req('GET', '/issues?status=OPEN&priority=HIGH');
check('filter status+priority', r.status === 200 && r.body.data.every((i) => i.status === 'OPEN' && i.priority === 'HIGH') && r.body.data.length > 0);
r = await rahul.c.req('GET', '/issues?search=smoke%20test');
check('search finds new issue', r.status === 200 && r.body.data.some((i) => i.id === issueId));
r = await rahul.c.req('GET', '/issues?search=.*');
check('regex chars in search are escaped (no error)', r.status === 200);
r = await rahul.c.req('GET', `/issues?assignee=${anil.user.id}`);
check('filter by assignee', r.status === 200 && r.body.data.every((i) => i.assignedTo?.id === anil.user.id));
r = await rahul.c.req('GET', '/issues?assignee=unassigned');
check('filter unassigned', r.status === 200 && r.body.data.every((i) => i.assignedTo === null));
r = await rahul.c.req('GET', '/issues?status[$ne]=OPEN');
check('operator injection in query -> 422', r.status === 422);
r = await rahul.c.req('GET', '/issues?limit=100000');
check('limit above max -> 422', r.status === 422);

r = await rahul.c.req('PATCH', `/issues/${issueId}`, { title: 'Smoke test issue (edited)', priority: 'LOW' });
check('creator edits issue', r.status === 200 && r.body.data.priority === 'LOW');
r = await rahul.c.req('PATCH', `/issues/${issueId}`, {});
check('empty update body -> 422', r.status === 422);
r = await rahul.c.req('PATCH', `/issues/${issueId}/assignee`, { assignedTo: anil.user.id });
check('assign issue to anil', r.status === 200 && r.body.data.assignedTo.id === anil.user.id);
r = await anil.c.req('PATCH', `/issues/${issueId}/status`, { status: 'IN_PROGRESS' });
check('assignee changes status', r.status === 200 && r.body.data.status === 'IN_PROGRESS');
r = await rahul.c.req('PATCH', `/issues/${issueId}/status`, { status: 'DONE' });
check('invalid status -> 422', r.status === 422);
r = await john.c.req('PATCH', `/issues/${issueId}/status`, { status: 'CLOSED' });
check('unrelated user changes status -> 403', r.status === 403);
r = await john.c.req('PATCH', `/issues/${issueId}`, { title: 'hijack' });
check('unrelated user edits issue -> 403', r.status === 403);
r = await anil.c.req('PATCH', `/issues/${issueId}/assignee`, { assignedTo: john.user.id });
check('assignee cannot reassign -> 403', r.status === 403);
r = await john.c.req('DELETE', `/issues/${issueId}`);
check('unrelated user deletes issue -> 403', r.status === 403);
r = await rahul.c.req('PATCH', `/issues/${issueId}/assignee`, { assignedTo: null });
check('unassign (null)', r.status === 200 && r.body.data.assignedTo === null);

// ---- comments
r = await john.c.req('POST', `/issues/${issueId}/comments`, { content: '' });
check('empty comment -> 422', r.status === 422);
r = await john.c.req('POST', `/issues/${MISSING_ID}/comments`, { content: 'hi' });
check('comment on missing issue -> 404', r.status === 404);
r = await john.c.req('POST', `/issues/${issueId}/comments`, { content: 'First comment' });
check('create comment -> 201', r.status === 201 && r.body.data.author.id === john.user.id);
const commentId = r.body.data.id;
r = await john.c.req('GET', `/issues/${issueId}/comments`);
check('list comments', r.status === 200 && r.body.data.length === 1 && r.body.pagination.total === 1);
r = await anil.c.req('PATCH', `/comments/${commentId}`, { content: 'tamper' });
check("other user edits comment -> 403", r.status === 403);
r = await admin.c.req('PATCH', `/comments/${commentId}`, { content: 'tamper' });
check("admin cannot edit others' comment -> 403", r.status === 403);
r = await john.c.req('PATCH', `/comments/${commentId}`, { content: 'Edited comment' });
check('author edits comment', r.status === 200 && r.body.data.content === 'Edited comment');
r = await anil.c.req('DELETE', `/comments/${commentId}`);
check("other user deletes comment -> 403", r.status === 403);
r = await admin.c.req('DELETE', `/comments/${commentId}`);
check('admin deletes comment', r.status === 200);
r = await john.c.req('PATCH', `/comments/${commentId}`, { content: 'gone' });
check('edit deleted comment -> 404', r.status === 404);
await john.c.req('POST', `/issues/${issueId}/comments`, { content: 'Will be cascade-deleted' });

// ---- dashboard
r = await rahul.c.req('GET', '/dashboard/summary');
const d = r.body?.data;
check('dashboard summary', r.status === 200 && d.totalIssues === d.openIssues + d.inProgressIssues + d.closedIssues && d.totalIssues >= 9 && typeof d.myIssues === 'number' && d.recentIssues.length > 0, JSON.stringify(r.body));

// ---- delete (admin may delete anything)
r = await admin.c.req('DELETE', `/issues/${issueId}`);
check('admin deletes issue', r.status === 200);
r = await admin.c.req('GET', `/issues/${issueId}`);
check('deleted issue -> 404', r.status === 404);
r = await admin.c.req('GET', `/issues/${issueId}/comments`);
check('comments of deleted issue -> 404', r.status === 404);

// ---- misc / CSRF
r = await anon.req('GET', '/nope');
check('unknown route -> 404 JSON', r.status === 404 && r.body?.success === false);
r = await rahul.c.req('POST', '/issues', { title: 'csrf', description: 'x' }, { Origin: 'https://evil.example' });
check('state-changing request from foreign Origin -> 403', r.status === 403);
r = await anon.req('GET', '/health');
check('helmet headers present', r.headers.get('x-content-type-options') === 'nosniff' && !r.headers.get('x-powered-by'));

console.log(failed ? `\n${failed} check(s) FAILED` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
