import { getImageConfig } from '@/lib/tmdb-config';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const config = await getImageConfig();

		return NextResponse.json(config);
	} catch (error) {
		return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
	}
}
