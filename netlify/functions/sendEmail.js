require('dotenv').config();
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Parse the request body
  let { name, email, phone, message } = {};
  try {
    ({ name, email, phone, message } = JSON.parse(event.body));
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
    service: 'gmail',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  // Format the email content with phone number and a more polished look
  const mailOptions = {
    from: 'TechwithBrands Web Contact Form <no-reply@techwithbrands.com>',
    to: RECEIVER_EMAIL,
    subject: `Contact Form Submission from ${name}`,
    text: `
      You have received a new contact form submission from TechwithBrands:

      Name: ${name}
      Email: ${email}
      Phone: ${phone}

      Message:
      ${message}

      ------------------------------------------------
      This email was sent from the TrendwithBrands website contact form.
    `,
    html: `
      <p>You have received a new contact form submission from your website:</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <hr>
      <p style="color: #888;">This email was sent from the TechwithBrands website contact form.</p>
    `,
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
