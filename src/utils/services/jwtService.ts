import jwt from 'jsonwebtoken';
//import { IJwt } from '../types/IJwt';

type DecodedActivationToken = {
  _id: string;
  iat: number;
  exp: number;
};

const createActivationToken = (_id: string): string => {
  return jwt.sign({ _id }, process.env.ACTIVATION_TOKEN_SECRET as jwt.Secret, {
    expiresIn: '5m',
  });
};

const verifyActivationToken = (token: string) => {
  const decodedToken = jwt.verify(
    token,
    process.env.ACTIVATION_TOKEN_SECRET as jwt.Secret
  ) as DecodedActivationToken;
  return decodedToken._id;
};

const createAccessToken = (_id: string): string => {
  return jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET as jwt.Secret, {
    expiresIn: '15m',
  });
};

const verifyAccessToken = (token: string) => {
  const decodedToken = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as jwt.Secret
  ) as DecodedActivationToken;
  return decodedToken._id;
};

const createRefreshToken = (_id: string): string => {
  return jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET as jwt.Secret);
};

// const verifyToken = async (token: string): Promise<jwt.VerifyErrors | IJwt> => {
//   return new Promise((resolve, reject) => {
//     jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err, payload) => {
//       if (err) return reject(err);
//       resolve(payload as IJwt);
//     });
//   });
// };

export const jwtService = {
  createActivationToken,
  verifyActivationToken,
  createAccessToken,
  verifyAccessToken,
  createRefreshToken,
  //verifyToken,
};
