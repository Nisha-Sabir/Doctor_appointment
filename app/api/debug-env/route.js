import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    has_kv_url: !!process.env.KV_REST_API_URL,
    has_kv_token: !!process.env.KV_REST_API_TOKEN,
    kv_url_prefix: process.env.KV_REST_API_URL?.slice(0, 30) || 'NOT SET',
    node_env: process.env.NODE_ENV,
  });
}
