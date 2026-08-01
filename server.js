import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const geminiApiKey = process.env.GEMINI_API_KEY;

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const contactToEmail = process.env.CONTACT_TO_EMAIL;
const contactFromEmail = process.env.CONTACT_FROM_EMAIL || smtpUser;
const isContactDebug = process.env.CONTACT_DEBUG === 'true';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname, { index: false }));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'aurafi-website-2.html'));
});

const transporter = (smtpHost && smtpUser && smtpPass)
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    })
  : null;

app.post('/api/contact', async (req, res) => {
  if (!transporter || !contactToEmail || !contactFromEmail) {
    const missingConfig = [
      !transporter ? 'SMTP transport (check SMTP_HOST/SMTP_USER/SMTP_PASS)' : null,
      !contactToEmail ? 'CONTACT_TO_EMAIL' : null,
      !contactFromEmail ? 'CONTACT_FROM_EMAIL' : null
    ].filter(Boolean);

    if (isContactDebug) {
      console.error('[CONTACT CONFIG ERROR]', { missingConfig });
    }

    return res.status(500).json({ error: 'Contact email is not configured on server' });
  }

  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim();
  const company = String(req.body?.company || '').trim();
  const message = String(req.body?.message || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;max-width:640px">
      <h2 style="margin:0 0 16px">New AURAFi Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${message}</p>
    </div>
  `;

  const text = [
    'New AURAFi Contact Form Submission',
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || 'N/A'}`,
    'Message:',
    message
  ].join('\n');

  try {
    await transporter.sendMail({
      from: contactFromEmail,
      to: contactToEmail,
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      text,
      html
    });

    return res.json({ ok: true });
  } catch (error) {
    const debugInfo = {
      message: error?.message,
      code: error?.code,
      responseCode: error?.responseCode,
      response: error?.response,
      command: error?.command
    };

    console.error('[CONTACT EMAIL ERROR]', debugInfo);

    if (isContactDebug) {
      return res.status(500).json({ error: 'Failed to send email', debug: debugInfo });
    }

    return res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/chat', async (req, res) => {
  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY in environment' });
  }

  const history = Array.isArray(req.body?.history) ? req.body.history : [];
  const safeHistory = history
    .filter((item) => item && (item.role === 'user' || item.role === 'model') && typeof item.text === 'string')
    .slice(-12)
    .map((item) => ({
      role: item.role,
      parts: [{ text: item.text }]
    }));

  if (!safeHistory.length) {
    return res.status(400).json({ error: 'No chat history provided' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          role: 'system',
          parts: [
            {
              text: 'You are AURAFi Assistant for an AI-powered branding agency website. Keep responses concise, practical, and sales-assistive. Focus on services, onboarding, and project inquiries.'
            }
          ]
        },
        contents: safeHistory,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 600
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({ error: 'Gemini API error', details: errorText });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join(' ').trim();

    return res.json({ reply: reply || 'I could not generate a response right now.' });
  } catch (error) {
    return res.status(500).json({ error: 'Server request failed' });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'aurafi-website-2.html'));
});

app.listen(port, () => {
  console.log(`AURAFi website running on http://localhost:${port}`);

  if (!transporter) {
    console.warn('[SMTP] Transport not initialized. Check SMTP_HOST/SMTP_USER/SMTP_PASS.');
    return;
  }

  transporter.verify()
    .then(() => {
      console.log('[SMTP] Transport verified and ready.');
    })
    .catch((error) => {
      console.error('[SMTP VERIFY ERROR]', {
        message: error?.message,
        code: error?.code,
        responseCode: error?.responseCode,
        response: error?.response,
        command: error?.command
      });
    });
});
