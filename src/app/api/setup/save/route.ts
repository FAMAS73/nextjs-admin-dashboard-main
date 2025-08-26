import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { configuration, settings, event } = await request.json();

    if (!configuration || !settings || !event) {
      return NextResponse.json(
        { error: 'Missing configuration data' },
        { status: 400 }
      );
    }

    // Save configuration as a preset in the database
    const presetData = {
      name: `Quick Setup - ${settings.serverName}`,
      description: `Auto-generated setup for ${event.track} with ${settings.carGroup} cars`,
      configuration,
      settings,
      event,
      created_by: 'system', // You could get this from auth context
      is_active: true
    };

    const { data: preset, error: presetError } = await supabase
      .from('configuration_presets')
      .insert([presetData])
      .select()
      .single();

    if (presetError) {
      console.error('Error saving preset to database:', presetError);
      return NextResponse.json(
        { error: 'Failed to save configuration to database' },
        { status: 500 }
      );
    }

    // Also save to server_configurations table for tracking
    const serverConfigData = {
      config_type: 'quick_setup',
      config_data: {
        configuration,
        settings,
        event
      },
      created_at: new Date().toISOString(),
      is_active: true
    };

    const { error: configError } = await supabase
      .from('server_configurations')
      .insert([serverConfigData]);

    if (configError) {
      console.warn('Warning: Failed to save to server_configurations:', configError);
      // Don't fail the request if this fails, as the preset was saved successfully
    }

    return NextResponse.json({
      success: true,
      message: 'Configuration saved to database successfully',
      presetId: preset.id
    });

  } catch (error) {
    console.error('Error in setup save API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}