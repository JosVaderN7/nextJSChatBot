import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { messages } = await req.json();

    // Procesa los mensajes y genera una respuesta
    const responseMessage = {
        text: "Esta es una respuesta de ejemplo del servidor."
    };

    return NextResponse.json(responseMessage);
}

export async function GET() {
    return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
}