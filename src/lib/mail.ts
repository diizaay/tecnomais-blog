import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  auth: {
    user: process.env.EMAIL_SERVER_USER || '',
    pass: process.env.EMAIL_SERVER_PASSWORD || '',
  },
});

export const sendSubscriptionEmail = async (email: string, name?: string) => {
  const mailOptions = {
    from: `"TecnoMais" <${process.env.EMAIL_FROM || 'oi@tecnomais.online'}>`,
    to: email,
    subject: 'Welcome to TecnoMais - Subscription Confirmed!',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1d1d1f;">
        <h1 style="color: #0066cc;">TecnoMais</h1>
        <p>Olá${name ? ` ${name}` : ''},</p>
        <p>Obrigado por se inscrever na nossa newsletter! Agora você receberá as últimas novidades sobre IA, tecnologia e produtividade diretamente no seu e-mail.</p>
        <p>Estamos felizes em ter você conosco.</p>
        <hr style="border: none; border-top: 1px solid #f5f5f7; margin: 20px 0;" />
        <p style="font-size: 12px; color: #86868b;">Você recebeu este e-mail porque se inscreveu no site TecnoMais.</p>
      </div>
    `,
  };

  try {
    // If no real credentials, log the content for simulation
    if (!process.env.EMAIL_SERVER_USER) {
      console.log('--- ENVIEI EMAIL DE SIMULAÇÃO ---');
      console.log('Para:', email);
      console.log('Assunto:', mailOptions.subject);
      console.log('---------------------------------');
      return { success: true, preview: true };
    }

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending subscription email:', error);
    return { success: false, error };
  }
};
