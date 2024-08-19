require('dotenv').config();
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Parse the request body
  let { name, email, message } = {};
  try {
    ({ name, email, message } = JSON.parse(event.body));
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request payload.' }),
    };
  }

  // Validate environment variables
  const { SMTP_USER, SMTP_PASS, RECEIVER_EMAIL } = process.env;
  if (!SMTP_USER || !SMTP_PASS || !RECEIVER_EMAIL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Missing environment variables.' }),
    };
  }

  // Create a transporter object using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail', // 'Gmail' should be lowercase
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: 'TrendwithBrands Web Contact Form',
    to: RECEIVER_EMAIL,
    subject: `Contact Form Submission from ${name}`,
    text: message,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to send email.',
        error: error.message,
      }),
    };
  }
};
