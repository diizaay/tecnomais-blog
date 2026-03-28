import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const report = await req.json();
    const filePath = path.join(process.cwd(), 'public', 'csp-violations.json');
    
    // Read current log
    let currentLog = [];
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (currentLog.length < 50) { // Limit to 50 entries
          currentLog = JSON.parse(content || '[]');
      }
    }
    
    // Add new report with timestamp
    currentLog.push({
      timestamp: new Date().toISOString(),
      ...report
    });
    
    // Limit to 100 entries
    if (currentLog.length > 100) currentLog.shift();
    
    // Write back
    fs.writeFileSync(filePath, JSON.stringify(currentLog, null, 2));
    
    return NextResponse.json({ status: 'logged' }, { status: 200 });
  } catch (err) {
    console.error('Failed to log CSP report:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
