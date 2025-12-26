import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const response = NextResponse.redirect(new URL('/konto', request.url));
    return response;
  }

  return NextResponse.redirect(new URL('/auth/error', request.url));
}
