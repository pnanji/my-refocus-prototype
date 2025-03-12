import { NextResponse } from 'next/server';
import { getClients } from '@/lib/data';

export async function GET() {
  try {
    const clients = getClients();
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
} 