export default async function handler(req, res) {
  // শুধুমাত্র POST রিকোয়েস্ট অ্যালাউ করার জন্য
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, target, phone, dialingCode } = req.body || {};

  // ==========================================
  // ১. মোড: BreachDirectory API (ডাটা লিক স্ক্যান)
  // ==========================================
  if (type === 'breach') {
    if (!target) {
      return res.status(400).json({ error: 'Input term is required' });
    }
    
    try {
      const response = await fetch(`https://breachdirectory-cheaper-version.p.rapidapi.com/?term=${encodeURIComponent(target)}&func=auto`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY, // Vercel Environment Variable থেকে কী নিবে
          'x-rapidapi-host': 'breachdirectory-cheaper-version.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return res.status(200).json({ success: true, mode: 'breach', data: data });
    } catch (error) {
      return res.status(500).json({ error: 'Breach API Failure', details: error.message });
    }
  }

  // ==========================================
  // ২. মোড: Truecaller Data2 API (নম্বর ইনফো)
  // ==========================================
  if (type === 'truecaller') {
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    // কান্ট্রি কোড সহ ফুল নম্বর তৈরি (ডিফল্ট: 880)
    const fullNumber = `${dialingCode || '880'}${phone}`;
    
    try {
      const response = await fetch(`https://truecaller-data2.p.rapidapi.com/search/${fullNumber}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'truecaller-data2.p.rapidapi.com',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return res.status(200).json({ success: true, mode: 'truecaller', data: data });
    } catch (error) {
      return res.status(500).json({ error: 'Truecaller API Failure', details: error.message });
    }
  }

  // রিকোয়েস্ট টাইপ ম্যাচ না করলে
  return res.status(400).json({ error: 'Invalid scan type specified' });
}
