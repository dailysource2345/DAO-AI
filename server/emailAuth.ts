import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { storage } from "./storage";
import { nanoid } from "nanoid";

// Configure nodemailer (using ethereal for development)
const createEmailTransporter = async () => {
  // For development, we'll use ethereal email
  const testAccount = await nodemailer.createTestAccount();
  
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// Generate random verification code
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
export const sendVerificationEmail = async (email: string, code: string) => {
  const transporter = await createEmailTransporter();
  
  const mailOptions = {
    from: '"Governance Reputation" <noreply@daoai.com>',
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p>Welcome to Governance Reputation for Web3 Communities!</p>
        <p>Your verification code is:</p>
        <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

// Setup passport local strategy for email authentication
export const setupEmailAuth = () => {
  passport.use('local-signup', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          return done(null, false, { message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Generate user ID
        const userId = nanoid();

        // Create user
        const user = await storage.createUser({
          id: userId,
          email,
          password: hashedPassword,
          username: req.body.username || null,
          firstName: req.body.firstName || null,
          lastName: req.body.lastName || null,
          emailVerified: false,
          authProvider: 'email'
        });

        // Generate and send verification code
        const verificationCode = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await storage.createEmailVerificationCode({
          email,
          code: verificationCode,
          expiresAt
        });

        await sendVerificationEmail(email, verificationCode);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.use('local-signin', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        if (!user.password) {
          return done(null, false, { message: 'Please use social login' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        if (!user.emailVerified) {
          return done(null, false, { message: 'Please verify your email first' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
};

// Verify email with code
export const verifyEmailCode = async (email: string, code: string): Promise<boolean> => {
  const verificationRecord = await storage.getEmailVerificationCode(email, code);
  
  if (!verificationRecord) {
    return false;
  }

  if (verificationRecord.expiresAt < new Date()) {
    await storage.deleteEmailVerificationCode(email);
    return false;
  }

  // Mark user as verified
  const user = await storage.getUserByEmail(email);
  if (user) {
    await storage.updateUser(user.id, { emailVerified: true });
    await storage.deleteEmailVerificationCode(email);
    return true;
  }

  return false;
};

// Resend verification code
export const resendVerificationCode = async (email: string): Promise<boolean> => {
  const user = await storage.getUserByEmail(email);
  if (!user || user.emailVerified) {
    return false;
  }

  // Delete old codes
  await storage.deleteEmailVerificationCode(email);

  // Generate new code
  const verificationCode = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await storage.createEmailVerificationCode({
    email,
    code: verificationCode,
    expiresAt
  });

  await sendVerificationEmail(email, verificationCode);
  return true;
};

// Generate cryptographically secure random password
export const generateRandomPassword = () => {
  // Use nanoid which is based on crypto.randomBytes for cryptographically secure random generation
  // Create a custom alphabet that's user-friendly (excludes similar-looking characters)
  const { customAlphabet } = require('nanoid');
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*';
  const generateSecurePassword = customAlphabet(alphabet, 16);
  return generateSecurePassword();
};

// Send company dashboard credentials email
export const sendCompanyCredentialsEmail = async (
  companyName: string,
  email: string,
  password: string,
  dashboardUrl: string
) => {
  const transporter = await createEmailTransporter();
  
  const mailOptions = {
    from: '"Web3 Reviews Platform" <noreply@daoai.com>',
    to: email,
    subject: `Your ${companyName} Business Dashboard Access`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Welcome to Your Business Dashboard</h2>
        <p>Your business dashboard has been created for <strong>${companyName}</strong>.</p>
        
        <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">Login Credentials</h3>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 10px 0;"><strong>Password:</strong> <code style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px;">${password}</code></p>
          <p style="margin: 10px 0;"><strong>Dashboard URL:</strong> <a href="${dashboardUrl}" style="color: #2563eb;">${dashboardUrl}</a></p>
        </div>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;"><strong>⚠️ Important:</strong> Please change your password after your first login for security purposes.</p>
        </div>

        <h3 style="color: #1e293b;">What You Can Do:</h3>
        <ul style="color: #475569; line-height: 1.8;">
          <li>Manage your company profile and information</li>
          <li>View and respond to customer reviews</li>
          <li>Access analytics and insights</li>
          <li>Update your company's verification status</li>
        </ul>

        <p style="color: #64748b; margin-top: 30px;">If you didn't expect this email or have questions, please contact our support team.</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Company credentials email sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  return nodemailer.getTestMessageUrl(info);
};