import { UserModel } from './user.model';
import { LoginDetails } from '../../utils/types/LoginDetails';

export class UserService {
  public async findUserByEmail(email: string) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('E-mail does not exist.');

    return user;
  }

  public async findUserById(_id: string) {
    const user = await UserModel.findById(_id);
    if (!user) throw new Error('User does not exist.');

    return user;
  }

  public async resetPassword(_id: string, password: string) {
    await UserModel.updateOne({ _id }, { password: password });
  }

  public async signup(
    username: string,
    email: string,
    password: string
  ): Promise<string> {
    const userByUsername = await UserModel.findOne({ username });
    if (userByUsername) throw new Error('Username already exists.');

    const userByEmail = await UserModel.findOne({ email });
    if (userByEmail) throw new Error('E-mail already exists.');

    const user = await UserModel.create({
      username,
      email,
      password,
    });

    return user._id.toString();
  }

  public async login(
    username: string,
    password: string
  ): Promise<LoginDetails> {
    const user = await UserModel.findOne({ username });

    if (!user) throw new Error('Username does not exist.');

    if (await user.isValidPassword(password)) {
      const { _id, username, email, isActive, role, avatar, createdAt } = user;

      return {
        _id: _id.toString(),
        username,
        email,
        isActive,
        role,
        avatar,
        createdAt,
      };
    } else {
      throw new Error('Invalid password.');
    }
  }
}
