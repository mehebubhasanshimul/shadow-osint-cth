export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { target } = req.body || {};

  if (!target) {
    return res.status(400).json({ error: 'Input term is required' });
  }

  try {
    const response = await fetch(`https://breachdirectory-cheaper-version.p.rapidapi.com/?term=${encodeURIComponent(target)}&func=auto`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'breachdirectory-cheaper-version.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return res.status(200).json({ success: true, data: data });
    
  } catch (error) {
    return res.status(500).json({ error: 'Breach API Failure', details: error.message });
  }
}
