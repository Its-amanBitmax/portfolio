const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST, // smtp.gmail.com
  port: Number(process.env.MAIL_PORT), // ✅ convert to number
  secure: false, // ✅ MUST be false for 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // Gmail App Password
  },
  tls: {
    rejectUnauthorized: false, // ✅ Render compatibility
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

// ✅ OPTIONAL but HIGHLY recommended
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection failed ❌", error);
  } else {
    console.log("SMTP connected successfully ✅");
  }
});

const sendMail = async ({ to, subject, html }) => {
  return await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = { sendMail };
