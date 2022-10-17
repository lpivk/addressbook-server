import { Router, RequestHandler } from 'express';

import { UserService } from './user.service';

import { IController } from '../../utils/types';
import { emailService, jwtService } from '../../utils/services';

export default class UserController implements IController {
  public path = '/auth';
  public router = Router();
  private UserService = new UserService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(`${this.path}/signup`, this.signup);
    this.router.post(`${this.path}/activate`, this.activateUser);
    this.router.post(`${this.path}/send-activation-email`, this.sendActivationEmail);
    this.router.post(`${this.path}/forgot-password`, this.forgotPassword);
    this.router.post(`${this.path}/reset-password`, this.resetPassword);
    this.router.post(`${this.path}/login`, this.login);
  }

  private signup: RequestHandler = async (req, res) => {
    const { username, email, password } = req.body;

    try {
      const _id = await this.UserService.signup(username, email, password);
      const activationToken = jwtService.createActivationToken(_id);

      emailService.sendActivationEmail(email, activationToken);

      res.status(201).json({
        activationToken,
        message: 'Please check your e-mail.',
      });
    } catch (error) {
      const err = error as Error;

      res.status(400).json({ message: err.message });
    }
  };

  private sendActivationEmail: RequestHandler = async (req, res) => {
    const { email } = req.body;

    try {
      const { _id } = await this.UserService.findUserByEmail(email);
      const activationToken = jwtService.createActivationToken(_id.toString());

      emailService.sendActivationEmail(email, activationToken);

      res.status(200).json({
        activationToken,
        message: 'Please check your e-mail.',
      });
    } catch (error) {
      const err = error as Error;

      res.status(404).json({ message: err.message });
    }
  };

  private activateUser: RequestHandler = async (req, res) => {
    const { activationToken } = req.body;

    try {
      const _id = jwtService.verifyActivationToken(activationToken);
      const user = await this.UserService.findUserById(_id);

      await user.updateOne({ isActive: true });

      res.status(200).json({ message: 'Your account has been activated.' });
    } catch (error) {
      res.status(400).json({
        message: 'You are using invalid or expired link.',
      });
    }
  };

  private forgotPassword: RequestHandler = async (req, res) => {
    const { email } = req.body;

    try {
      const { _id } = await this.UserService.findUserByEmail(email);
      const accessToken = jwtService.createForgotPasswordToken(_id.toString());

      emailService.sendForgotPasswordEmail(email, accessToken);

      res.status(200).json({
        accessToken,
        message: 'Please check your e-mail.',
      });
    } catch (error) {
      const err = error as Error;

      res.status(404).json({ message: err.message });
    }
  };

  private resetPassword: RequestHandler = async (req, res) => {
    const { forgotPasswordToken, password } = req.body;

    try {
      const _id = jwtService.verifyForgotPasswordToken(forgotPasswordToken);
      await this.UserService.resetPassword(_id, password);

      res.status(200).json({ message: 'Your password has been reset.' });
    } catch (error) {
      res.status(400).json({
        message: 'You are using invalid or expired link.',
      });
    }
  };

  private login: RequestHandler = async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await this.UserService.login(username, password);
      const accessToken = jwtService.createAccessToken(user._id);

      res.status(200).json({ details: user, token: accessToken });
    } catch (error) {
      const err = error as Error;

      res.status(400).json({ message: err.message });
    }
  };
}
