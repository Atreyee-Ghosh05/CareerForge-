import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
};

export const sendWelcomeEmail = async (user) => {
  const message = `
    <h2>Welcome to CareerForge!</h2>
    <p>Hi ${user.firstName},</p>
    <p>Thank you for signing up. Start building your career today!</p>
    <p>Best regards,<br>CareerForge Team</p>
  `;

  return sendEmail({
    email: user.email,
    subject: 'Welcome to CareerForge - Build. Apply. Get Hired.',
    message,
  });
};

export const sendResetPasswordEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const message = `
    <h2>Password Reset Request</h2>
    <p>Hi ${user.firstName},</p>
    <p>We received a request to reset your password. Click the link below to proceed:</p>
    <a href="${resetUrl}" style="background-color: #FFD700; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Reset Password
    </a>
    <p>This link expires in 24 hours.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <p>Best regards,<br>CareerForge Team</p>
  `;

  return sendEmail({
    email: user.email,
    subject: 'CareerForge - Password Reset Request',
    message,
  });
};

export const sendSubscriptionConfirmation = async (user, plan) => {
  const message = `
    <h2>Subscription Confirmed!</h2>
    <p>Hi ${user.firstName},</p>
    <p>Your subscription to <strong>${plan.displayName}</strong> has been activated.</p>
    <p>Features unlocked:</p>
    <ul>
      <li>Unlimited Resumes</li>
      <li>Unlimited Applications</li>
      <li>Premium Templates</li>
    </ul>
    <p>Best regards,<br>CareerForge Team</p>
  `;

  return sendEmail({
    email: user.email,
    subject: `CareerForge - ${plan.displayName} Activated`,
    message,
  });
};
