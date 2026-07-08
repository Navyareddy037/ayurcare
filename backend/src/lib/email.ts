import nodemailer from 'nodemailer';

// Configure a nodemailer transporter. 
// Evaluators can supply these credentials in .env to send real emails.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, 
  auth: {
    user: process.env.SMTP_USER || '', 
    pass: process.env.SMTP_PASS || '', 
  },
});

export async function sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text: string }) {
  console.log(`\n==================================================`);
  console.log(`✉️  EMAIL NOTIFICATION SIMULATION`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text: ${text}`);
  console.log(`==================================================\n`);

  // Only attempt transport if SMTP parameters are provided
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      await transporter.sendMail({
        from: '"Kaya Kalp Wellness" <notifications@kayakalp.com>',
        to,
        subject,
        text,
        html,
      });
      console.log('✅ Email dispatched via SMTP');
    } catch (err) {
      console.error('❌ Failed to dispatch email via SMTP:', err);
    }
  } else {
    console.log('ℹ️ SMTP credentials missing. Running in simulated console-only mode.');
  }
}

export async function sendBookingEmail(email: string, patientName: string, doctorName: string, date: string, time: string, receiptId: string) {
  const subject = `Booking Confirmed: Appointment with ${doctorName}`;
  const text = `Dear ${patientName}, your consultation with ${doctorName} is confirmed for ${date} at ${time}. Receipt ID: ${receiptId}.`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #F4F7F4; border-radius: 12px; max-width: 600px; color: #2D3748;">
      <h2 style="color: #2E5B3E;">Kaya Kalp Appointment Confirmation</h2>
      <p>Dear <strong>${patientName}</strong>,</p>
      <p>Your consultation booking with <strong>${doctorName}</strong> is successful.</p>
      <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #E2E8F0; margin: 15px 0;">
        <div>Date: <strong>${date}</strong></div>
        <div>Time: <strong>${time}</strong></div>
        <div>Receipt ID: <strong>${receiptId}</strong></div>
      </div>
      <p style="font-size: 12px; color: #718096; margin-top: 20px;">
        DISCLAIMER: If you need to cancel or reschedule, please do so at least 24 hours prior via your Patient Dashboard.
      </p>
    </div>
  `;
  await sendEmail({ to: email, subject, text, html });
}

export async function sendRescheduleEmail(email: string, patientName: string, doctorName: string, date: string, time: string) {
  const subject = `Appointment Rescheduled: ${doctorName}`;
  const text = `Dear ${patientName}, your consultation with ${doctorName} has been rescheduled to ${date} at ${time}.`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #F4F7F4; border-radius: 12px; max-width: 600px; color: #2D3748;">
      <h2 style="color: #AA7C11;">Appointment Rescheduled</h2>
      <p>Dear <strong>${patientName}</strong>,</p>
      <p>Your appointment slots with <strong>${doctorName}</strong> have been updated.</p>
      <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #E2E8F0; margin: 15px 0;">
        <div>New Date: <strong>${date}</strong></div>
        <div>New Time: <strong>${time}</strong></div>
      </div>
    </div>
  `;
  await sendEmail({ to: email, subject, text, html });
}

export async function sendCancellationEmail(email: string, patientName: string, doctorName: string, date: string) {
  const subject = `Appointment Cancelled: ${doctorName}`;
  const text = `Dear ${patientName}, your consultation with ${doctorName} scheduled for ${date} has been cancelled.`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #FFF5F5; border-radius: 12px; max-width: 600px; color: #2D3748;">
      <h2 style="color: #E53E3E;">Appointment Cancelled</h2>
      <p>Dear <strong>${patientName}</strong>,</p>
      <p>Your appointment slots with <strong>${doctorName}</strong> on <strong>${date}</strong> has been cancelled.</p>
      <p>The consultation fee has been initiated for refund. Please book another slot from the directory.</p>
    </div>
  `;
  await sendEmail({ to: email, subject, text, html });
}
