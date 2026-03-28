import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, company, message, budget } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const TO_EMAIL = process.env.CONTACT_EMAIL || 'contact@overbrand.fr'

    if (!RESEND_API_KEY) {
      // Dev mode: just log and return success
      console.log('[Contact Form]', { name, email, phone, company, message, budget })
      return NextResponse.json({ ok: true })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'OverBrand <noreply@overbrand.fr>',
        to: [TO_EMAIL],
        reply_to: email,
        subject: `[OverBrand] Nouveau message de ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0d1a30;">
            <div style="background: linear-gradient(135deg, #2855a0, #3a6fd8); padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 2px;">OVERBRAND</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 13px;">Nouveau message reçu</p>
            </div>
            <div style="padding: 32px; background: #f7f8fc; border: 1px solid #c8d3e8;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 130px; color: #2855a0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Nom</td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 130px; color: #2855a0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #3a6fd8;">${email}</a></td></tr>
                ${phone ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 130px; color: #2855a0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Téléphone</td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${phone}</td></tr>` : ''}
                ${company ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 130px; color: #2855a0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Entreprise</td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${company}</td></tr>` : ''}
                ${budget ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 130px; color: #2855a0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Budget</td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${budget}</td></tr>` : ''}
              </table>
              <div style="margin-top: 24px;">
                <p style="font-weight: bold; color: #2855a0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Message</p>
                <p style="white-space: pre-wrap; background: white; border: 1px solid #c8d3e8; padding: 16px; border-radius: 4px; color: #3d5070; line-height: 1.6;">${message}</p>
              </div>
            </div>
            <div style="padding: 16px 32px; background: #e8edf7; text-align: center;">
              <p style="font-size: 11px; color: #7a90b0; margin: 0;">OverBrand — Agence Digitale Créative</p>
            </div>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('[Resend Error]', err)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Contact API]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
