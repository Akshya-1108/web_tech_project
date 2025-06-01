const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5173;

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8080', 'http://127.0.0.1:5500'],
}));
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/api/send', async (req, res) => {
  console.log('Received request:', req.body);
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const mailOptions = {
    from: `"DineTime Contact" <${process.env.EMAIL_USER}>`,
    to: 'atharvasrivastava9990@gmail.com',
    subject: `New Contact Message from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  try {
    console.log('Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

app.get('/api/test-email', async (req, res) => {
  const testMailOptions = {
    from: `"DineTime Test" <${process.env.EMAIL_USER}>`,
    to: 'atharvasrivastava9990@gmail.com',
    subject: 'Test Email from DineTime',
    text: 'This is a test email sent from the server.',
  };

  try {
    const info = await transporter.sendMail(testMailOptions);
    console.log('Test email sent:', info.response);
    res.status(200).json({ message: 'Test email sent successfully!' });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ error: 'Failed to send test email.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});