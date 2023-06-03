import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/user.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async validateUser(usernameOrEmail: string, password: string): Promise<any> {
    const user = await this.usersService.getByUsernameOrEmail(usernameOrEmail);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: { id: string }) {
    const { id } = user;
    const payload = { id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async sendEmailCode(email: string) {
    // 生成验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Update the user's VerificationCode in the database
    await this.prismaService.verificationCode.upsert({
      where: {
        contact: email,
      },
      update: { code: code, createdAt: new Date() },
      create: {
        code: code,
        contact: email,
        type: 'EMAIL',
      },
    });
    const getConfig = async (key: string) => {
      const config = await this.prismaService.config.findUnique({
        where: { key: key },
      });
      return config ? config.value : null;
    };

    // Fetch config data from the database
    const emailService = await getConfig('emailService');
    const emailUser = await getConfig('emailUser');
    const emailPass = await getConfig('emailPass');

    // Check if we got all necessary config data
    if (!emailService || !emailUser || !emailPass) {
      throw new Error('Missing email config data');
    }

    // Configure your mail transporter
    const transporter = nodemailer.createTransport({
      service: emailService,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Configure the email details
    const mailOptions = {
      from: emailUser,
      to: email,
      subject: '【神奇海螺】邮箱验证',
      html: `
    <p>亲爱的用户：</p>
    <p>您好！您正在神奇海螺进行邮箱验证，您的验证码为：</p>
    <h2>${code}</h2>
    <p>请在十分钟内输入此验证码完成验证。</p>
    <p>如果您并未进行此操作，请忽略此邮件。</p>
  `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  }

  async register(body: RegisterDto) {
    const { email, username, password, emailCode } = body;

    // 验证邮箱验证码
    const emailCodeExists =
      await this.prismaService.verificationCode.findUnique({
        where: {
          contact: email,
        },
      });

    if (!emailCodeExists) {
      throw new BadRequestException('邮箱验证码不存在');
    }

    if (emailCodeExists.code !== emailCode) {
      throw new BadRequestException('邮箱验证码错误');
    }

    const now = new Date();
    const createdAt = new Date(emailCodeExists.createdAt);
    const diff = now.getTime() - createdAt.getTime();
    const diffMinutes = Math.floor(diff / 1000 / 60);

    if (diffMinutes > 10) {
      throw new BadRequestException('邮箱验证码已过期');
    }

    // 删除邮箱验证码
    await this.prismaService.verificationCode.delete({
      where: {
        id: emailCodeExists.id,
      },
    });

    // 验证邮箱是否已经注册
    const userExists = await this.usersService.checkEmailExists(email);
    if (userExists) {
      throw new BadRequestException('邮箱已经被注册');
    }

    // 验证用户名是否已经注册
    const usernameExists = await this.usersService.checkUsernameExists(
      body.username,
    );
    if (usernameExists) {
      throw new BadRequestException('用户名已经被注册');
    }

    // 创建用户
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await this.usersService.create({
      username,
      email,
      passwordHash: hash,
      emailVerified: true,
    });
    return this.login(user);
  }
}
