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

  const { id, status, nota } = JSON.parse(event.body);

  const getRes = await fetch(API_URL, { headers: GH_HEADERS });
  if (!getRes.ok) return { statusCode: 404, body: 'Data file not found' };

  const file = await getRes.json();
  const data = JSON.parse(Buffer.from(file.content, 'base64').toString('utf-8'));

  const idx = data.findIndex(d => d.id === id);
  if (idx === -1) return { statusCode: 404, body: 'Priority not found' };

  data[idx].status = status;
  data[idx].updated_at = new Date().toISOString();
  if (nota !== undefined) data[idx].nota_arquiteto = nota;

  const putBody = {
    message: `[status] ${data[idx].vendedor} → ${data[idx].cliente}: ${status}`,
    content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
    sha: file.sha
  };

  const putRes = await fetch(API_URL, {
    method: 'PUT',
    headers: GH_HEADERS,
    body: JSON.stringify(putBody)
  });

  if (!putRes.ok) {
    return { statusCode: 500, body: 'Failed to update' };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ success: true })
  };
};
