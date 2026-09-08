import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAllStoreSettings, setStoreSetting, syncFromCloud } from '@/lib/runtimeStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await syncFromCloud();
    const runtimeSettings = getAllStoreSettings();

    let dbSettingsMap: Record<string, string> = {};
    try {
      const dbSettings = await prisma.storeSetting.findMany();
      dbSettings.forEach((s) => {
        dbSettingsMap[s.key] = s.value;
      });
    } catch (e) {}

    const mergedSettings = { ...dbSettingsMap, ...runtimeSettings };
    return NextResponse.json({ settings: mergedSettings });
  } catch (error) {
    return NextResponse.json({ settings: getAllStoreSettings() });
  }
}

export async function POST(request: Request) {
  try {
    await syncFromCloud();
    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Settings object is required' }, { status: 400 });
    }

    for (const [key, value] of Object.entries(settings)) {
      if (typeof value === 'string') {
        await setStoreSetting(key, value);

        try {
          await prisma.storeSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
          });
        } catch (e) {}
      }
    }

    const updated = getAllStoreSettings();
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error('Save settings error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to save settings' }, { status: 500 });
  }
}
