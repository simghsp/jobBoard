const nodemailer=require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

 const sendMail = async () => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: "test@example.com",
    subject: "Mailtrap Test Email",
    text: "Hello Sapna, this is a test email from your Job Board app!",
  });
  console.log("✅ Email sent successfully!");
};

module.exports = sendMail;