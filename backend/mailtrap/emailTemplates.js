const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
  <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);">
    <div style="background-color: #2b3f84; padding: 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Verify Your Email!</h1>
    </div>

    <div style="padding: 20px; background-color: #ffffff;">
      <p style="color: #333; font-size: 16px; text-align: center;">Greetings from <strong>CodeAlgo</strong>, thank you for joining us!</p>
      <p style="color: #333; font-size: 16px; text-align: center;">Please use the verification code below to get started:</p>

      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 3px; color: #2b3f84;">{verificationCode}</span>
      </div>

      <p style="color: #333; font-size: 16px;">Enter this code on the verification page to activate your account and start your coding journey</p>
      <p style="color: #333; font-size: 16px;">This code is valid for 15 minutes for security reasons.</p>

      <p style="color: #333; font-size: 16px; margin-top: 30px;">Best Regards,</p>
      <p style="color: #333; font-size: 16px;">The CodeAlgo Team</p>
    </div>
  </div>

  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>

`;




const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #e0e0e0;">
  <div style="background: #000000; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We’re confirming that your password for your CodeAlgo account has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #d32f2f; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If this wasn't you, please contact us immediately to secure your account.</p>
    <p>For added security, consider:</p>
    <ul>
      <li>Using a unique, strong password</li>
      <li>Enabling two-factor authentication</li>
      <li>Avoiding password reuse across different accounts</li>
    </ul>
    
    <p>Best regards,<br>The CodeAlgo Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>

`;


const WELCOME_ABOARD_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome Aboard</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #e0e0e0;">
  <div style="background: #000000; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Welcome to CodeAlgo!</h1>
  </div>
  <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello <strong>{fullname}</strong>,</p>
    <p style="color: #d32f2f;"><strong>Thank you for joining CodeAlgo!</strong></p>
    <p>With CodeAlgo, you can easily organize your day. Here’s what you can do:</p>
    <ul>
      <li><span style="color: #d32f2f;"><strong>Add Events</strong></span> to keep track of important tasks.</li>
      <li><span style="color: #d32f2f;"><strong>Set Reminders</strong></span> to ensure you never miss deadlines.</li>
      <li><span style="color: #d32f2f;"><strong>Get Notifications</strong></span> right when you need them.</li>
      <li><span style="color: #d32f2f;"><strong>Sync Across Devices</strong></span> to access your schedule anywhere.</li>
    </ul>
    <p>Start adding events and managing your time with CodeAlgo today!</p>
    <p>If you have any questions, reach out to our support team at <a href="mailto:support@CodeAlgo.com" style="color: #d32f2f;">support@CodeAlgo.com</a>.</p>
    <p>We look forward to helping you stay on track!</p>
    <p>Best regards,<br>The CodeAlgo Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;




const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #e0e0e0;">
  <div style="background: #000000; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your CodeAlgo password. If you did not request this, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
<a href="{resetURL}" style="background-color: #d32f2f; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>`;

module.exports = {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    WELCOME_ABOARD_TEMPLATE,
  };
