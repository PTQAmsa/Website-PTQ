import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * Keep-Alive Cron Job
 * 
 * Purpose: Ping Supabase database every 6 days to prevent auto-pause
 * Trigger: Vercel Cron (runs every 6 days at 00:00 UTC)
 * 
 * Supabase free tier auto-pauses projects after 7 days of inactivity.
 * This endpoint performs a simple database query to keep the project active.
 */

export async function GET(request: Request) {
  try {
    // Verify this is called by Vercel Cron (security check)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Perform a simple query to keep database active
    const { data, error } = await supabase
      .from('pendaftaran_santri')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Keep-alive query failed:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    // Log success
    console.log('Keep-alive ping successful:', {
      timestamp: new Date().toISOString(),
      recordsFound: data?.length || 0
    });

    return NextResponse.json({
      success: true,
      message: 'Database keep-alive ping successful',
      timestamp: new Date().toISOString(),
      recordsChecked: data?.length || 0
    });

  } catch (error: any) {
    console.error('Keep-alive cron error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
