exports.handler = async () => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO  = process.env.GITHUB_REPO;
  const FILE_PATH    = 'data/priorities.json';
  const API_URL      = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;

  const GH_HEADERS = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  };

  try {
    const res = await fetch(API_URL, { headers: GH_HEADERS });
    if (!res.ok) {
      return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: '[]' };
    }
    const file = await res.json();
    const data = JSON.parse(Buffer.from(file.content, 'base64').toString('utf-8'));

    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 3);
    const filtered = data.filter(d => new Date(d.created_at) >= cutoff);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(filtered)
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
