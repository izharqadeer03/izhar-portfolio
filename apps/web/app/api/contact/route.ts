import {
  deleteContactMessage,
  fetchContactConfig,
  fetchContactMessages,
  insertContactMessage,
  updateContactConfig,
  updateMessageStatus,
} from '@izhar-os/database';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const config = await fetchContactConfig();
    const isAdmin = isAuthorizedAdmin(req);

    if (isAdmin) {
      const messages = await fetchContactMessages();
      return NextResponse.json({
        success: true,
        data: { config, messages },
      });
    }

    return NextResponse.json({
      success: true,
      data: { config },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contact data' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, topic } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 },
      );
    }

    const saved = await insertContactMessage({
      name: String(name).trim(),
      email: String(email).trim(),
      topic: topic ? String(topic) : 'general',
      message: String(message).trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent and stored successfully',
      data: saved,
    });
  } catch (error) {
    console.error('Error in contact POST:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send message' },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateContactConfig(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update contact config' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'Message ID and status required' },
        { status: 400 },
      );
    }

    await updateMessageStatus(id, status);
    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update status' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Message ID required' }, { status: 400 });
    }

    await deleteContactMessage(id);
    return NextResponse.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete message' },
      { status: 500 },
    );
  }
}
