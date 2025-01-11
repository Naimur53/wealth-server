import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
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
    const { refreshToken, otp, ...result } = output;

    await sendEmail(
      { to: result.user.email },
      {
        subject: EmailTemplates.verify.subject,
        html: EmailTemplates.verify.html({
          token: otp,
        }),
      }
    );
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
    const { refreshToken, otp, ...result } = output;
    await sendEmail(
      { to: result.user.email },
      {
        subject: EmailTemplates.verify.subject,
        html: EmailTemplates.verify.html({ token: otp }),
      }
    );
    // set refresh token into cookie
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    sendResponse<ILoginResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Opt send successfully',
      data: result,
    });
  }
);
const sendForgotEmail: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.params;
    const output = await AuthService.sendForgotEmail(email || '');
    const { otp } = output;

    // set refresh token into cookie
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    sendResponse<{ otp: number }>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Opt send successfully',
      data: {
        otp,
      },
    });
  }
);
const sendDeleteUserEmail: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.params;
    await AuthService.sendDeleteUserEmail(email || '');

    // set refresh token into cookie
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    sendResponse<{ isOtpSend: boolean }>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Opt send successfully',
      data: {
        isOtpSend: true,
      },
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
    message: 'User logged successfully !',
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});
const verifyOtpForAdminLogin = catchAsync(
  async (req: Request, res: Response) => {
    const loginInfo = req.body;
    const result = await AuthService.verifyOtpForAdminLogin(loginInfo);

    // set refresh token into cookie
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    sendResponse<ILoginResponse>(res, {
      statusCode: 200,
      success: true,
      message: 'User logged successfully !',
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  }
);
const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = req.body;
  const result = await AuthService.loginAdmin(loginInfo);

  sendResponse<{ otp: string }>(res, {
    statusCode: 200,
    success: true,
    message: 'opt send successfully',
    data: result,
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
  const { token } = req.body;
  const user = req.user as JwtPayload;
  if (!token) {
    new ApiError(httpStatus.BAD_REQUEST, 'Token not found');
  }
  const result = await AuthService.verifySignupToken(token, user.userId);

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Token verify successfully',
    data: result,
  });
});

const verifyForgotToken = catchAsync(async (req: Request, res: Response) => {
  const { token, email } = req.body;
  if (!token) {
    new ApiError(httpStatus.BAD_REQUEST, 'Token not found');
  }
  if (!email) {
    new ApiError(httpStatus.BAD_REQUEST, 'Email not found');
  }
  const result = await AuthService.verifyForgotToken(token, email);

  // set refresh token

  sendResponse<{ token: number; isValidate: boolean }>(res, {
    statusCode: 200,
    success: true,
    message: 'Token verify successfully',
    data: result,
  });
});
const verifyDeleteUserToken = catchAsync(
  async (req: Request, res: Response) => {
    const { token, email } = req.body;
    if (!token) {
      new ApiError(httpStatus.BAD_REQUEST, 'Token not found');
    }
    if (!email) {
      new ApiError(httpStatus.BAD_REQUEST, 'Email not found');
    }
    const result = await AuthService.verifyDeleteUserToken(token, email);

    // set refresh token

    sendResponse<{ token: number; isValidate: boolean }>(res, {
      statusCode: 200,
      success: true,
      message: 'Token verify successfully',
      data: result,
    });
  }
);

const changePassword: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const data = req.body;

    const output = await AuthService.changePassword(data);
    const { refreshToken, ...result } = output;

    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    sendResponse<ILoginResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'password change successfully!',
      data: result,
    });
  }
);
export const AuthController = {
  createUser,
  loginUser,
  refreshToken,
  verifySignupToken,
  resendEmail,
  sendForgotEmail,
  verifyForgotToken,
  changePassword,
  sendDeleteUserEmail,
  verifyDeleteUserToken,
  loginAdmin,
  verifyOtpForAdminLogin,
};
