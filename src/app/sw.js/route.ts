import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export async function GET() {
  const content = `self.options = {
    "domain": "5gvci.com",
    "zoneId": 10786373
}
self.lary = ""
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw')`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
