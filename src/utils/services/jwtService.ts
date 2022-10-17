import jwt from 'jsonwebtoken';

type DecodedToken = {
  _id: string;
  iat: number;
  exp: number;
};

const createActivationToken = (_id: string): string => {
  return jwt.sign({ _id }, process.env.ACTIVATION_TOKEN_SECRET as jwt.Secret, {
    expiresIn: '15m',
  });
};

const verifyActivationToken = (token: string) => {
  const decodedToken = jwt.verify(
    token,
    process.env.ACTIVATION_TOKEN_SECRET as jwt.Secret
  ) as DecodedToken;

  return decodedToken._id;
};

const createForgotPasswordToken = (_id: string): string => {
  return jwt.sign({ _id }, process.env.FORGOT_PASSWORD_TOKEN_SECRET as jwt.Secret, {
    expiresIn: '5m',
  });
};

const verifyForgotPasswordToken = (token: string) => {
  const decodedToken = jwt.verify(
    token,
    process.env.FORGOT_PASSWORD_TOKEN_SECRET as jwt.Secret
  ) as DecodedToken;

  return decodedToken._id;
};

const createAccessToken = (_id: string): string => {
  return jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET as jwt.Secret, {});
};

const verifyAccessToken = (token: string) => {
  const decodedToken = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as jwt.Secret
  ) as DecodedToken;

  return decodedToken._id;
};

export const jwtService = {
  createActivationToken,
  verifyActivationToken,
  createForgotPasswordToken,
  verifyForgotPasswordToken,
  createAccessToken,
  verifyAccessToken,
};
