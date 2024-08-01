// emailService.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const sendTestEmail = async (to: string, subject: string, text: string) => {
  const msg = {
    to,
    from: 'rmimiagavasquez@gmail.com', // Cambia esto por tu dirección de correo electrónico verificada en SendGrid
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log('Correo enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};
