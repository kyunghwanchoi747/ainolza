import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('key') !== 'migrate-now') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await getPayload({ config: configPromise });
    
    // Get raw DB instance
    const db = payload.db;
    
    // We can use the db instance to run the alter table command.
    // In Payload's SQLite adapter, db is Drizzle, but we can execute raw SQL on the underlying session.
    await db.drizzle.run(db.drizzle.raw(`ALTER TABLE orders ADD COLUMN vbank_reminder_sent integer;`));
    
    return NextResponse.json({ success: true, message: 'Migration executed successfully.' });
  } catch (error: any) {
    // Ignore error if column already exists
    if (error.message && error.message.includes('duplicate column name')) {
       return NextResponse.json({ success: true, message: 'Column already exists.' });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
