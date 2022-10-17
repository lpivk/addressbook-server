import nodemailer from 'nodemailer';

const { SENDER_EMAIL, SENDER_PASSWORD } = process.env;

const sendActivationEmail = (to: string, activationToken: string): void => {
  const url = `http://localhost:3000/reset-password/activate/${activationToken}`;

  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: SENDER_EMAIL,
      pass: SENDER_PASSWORD,
    },
  });

  const options = {
    from: SENDER_EMAIL,
    to: to,
    subject: 'Addressbook e-mail verification',
    html: `
        <div style="max-width: 500px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 100%;">
        <h2 style="text-align: center; text-transform: uppercase;color: teal;">
          SIGNUP SUCCESSFUL!
        </h2>
        <div style="text-align: center;">
          <p>
            Congratulations! You're almost set to start using Addressbook.
          </p>
          <p>
            Just click the button below to activate your account.
          </p>
          <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">
            ACTIVATE
          </a>
        </div>
      </div>
    `,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) return err;
    return info;
  });
};

const sendForgotPasswordEmail = (to: string, resetPasswordToken: string): void => {
  const url = `http://localhost:3000/reset-password/${resetPasswordToken}`;

  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: SENDER_EMAIL,
      pass: SENDER_PASSWORD,
    },
  });

  const options = {
    from: SENDER_EMAIL,
    to: to,
    subject: 'Forgot password for Addressbook?',
    html: `
        <div style="max-width: 500px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 100%;">
        <div style="text-align: center;">
          <p>
            Here is your link for resetting your password.
          </p>
          <p>
            Just click the button below and follow the steps.
          </p>
          <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">
            RESET PASSWORD
          </a>
        </div>
      </div>
    `,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) return err;
    return info;
  });
};

export const emailService = {
  sendActivationEmail,
  sendForgotPasswordEmail,
};
