import { UserRole } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import sendEmail from '../../../helpers/sendEmail';
import EmailTemplates from '../../../shared/EmailTemplates';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ILoginResponse, IRefreshTokenResponse } from './auth.Interface';
import { AuthService } from './auth.service';

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const data = req.body;

    const output = await AuthService.createUser(data);
    const { refreshToken, ...result } = output;

    await sendEmail(
      { to: result.user.email },
      {
        subject: EmailTemplates.verify.subject,
        html: EmailTemplates.verify.html({ token: refreshToken as string }),
      }
    );
    console.log('success');
    if (output.user.role == UserRole.seller) {
      await sendEmail(
        { to: config.emailUser as string },
        {
          subject: EmailTemplates.sellerRequest.subject,
          html: EmailTemplates.sellerRequest.html({
            userEmail: output.user.email,
            txId: output.user.txId as string,
          }),
        }
      );
    }
    // set refresh token into cookie
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    sendResponse<ILoginResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully!',
      data: result,
    });
  }
);
const resendEmail: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.params;

    const output = await AuthService.resendEmail(email || '');
    const { refreshToken, ...result } = output;
    await sendEmail(
      { to: result.user.email },
      {
        subject: EmailTemplates.verify.subject,
        html: EmailTemplates.verify.html({ token: refreshToken as string }),
      }
    );
    //
    console.log('success');
    // set refresh token into cookie
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    sendResponse<ILoginResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully!',
      data: result,
    });
  }
);
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = req.body;
  const result = await AuthService.loginUser(loginInfo);

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User lohggedin successfully !',
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'New access token generated successfully !',
    data: result,
  });
});
const verifySignupToken = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.params;
  if (!token) {
    new ApiError(httpStatus.BAD_REQUEST, 'Token not found');
  }
  console.log(token);
  const result = await AuthService.verifySignupToken(token as string);

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'New access token generated successfully !',
    data: result,
  });
});

export const AuthController = {
  createUser,
  loginUser,
  refreshToken,
  verifySignupToken,
  resendEmail,
};
