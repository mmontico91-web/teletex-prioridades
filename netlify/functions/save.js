exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO  = process.env.GITHUB_REPO;
  const FILE_PATH    = 'data/priorities.json';
  const API_URL      = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;

  const GH_HEADERS = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28'
  };

  let currentData = [];
  let sha;

  try {
    const getRes = await fetch(API_URL, { headers: GH_HEADERS });
    if (getRes.ok) {
      const file = await getRes.json();
      sha = file.sha;
      currentData = JSON.parse(Buffer.from(file.content, 'base64').toString('utf-8'));
    }
  } catch (_) {}

  const body = JSON.parse(event.body);
  const newEntry = {
    ...body,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    created_at: new Date().toISOString(),
    status: 'pendente'
  };

  currentData.push(newEntry);

  const putBody = {
    message: `[prioridade] ${newEntry.vendedor} → ${newEntry.cliente} | urgência ${newEntry.urgencia}`,
    content: Buffer.from(JSON.stringify(currentData, null, 2)).toString('base64'),
    ...(sha ? { sha } : {})
  };

  const putRes = await fetch(API_URL, {
    method: 'PUT',
    headers: GH_HEADERS,
    body: JSON.stringify(putBody)
  });

  if (!putRes.ok) {
    const err = await putRes.json();
    return { statusCode: 500, body: JSON.stringify({ error: 'GitHub write failed', details: err }) };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ success: true, id: newEntry.id })
  };
};
