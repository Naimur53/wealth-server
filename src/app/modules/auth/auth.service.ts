import { EUserStatus, EVerificationOtp, User, UserRole } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import createBycryptPassword from '../../../helpers/createBycryptPassword';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import sendEmail from '../../../helpers/sendEmail';
import EmailTemplates from '../../../shared/EmailTemplates';
import prisma from '../../../shared/prisma';
import generateOTP, { checkTimeOfOTP } from '../../../utils/generatateOpt';
import { UserService } from '../user/user.service';
import {
  ILogin,
  ILoginResponse,
  IRefreshTokenResponse,
  IVerifyTokeResponse,
} from './auth.Interface';
const createUser = async (user: User): Promise<ILoginResponse> => {
  // checking is user buyer
  const { password: givenPassword, ...rest } = user;
  const otp = generateOTP();
  const genarateBycryptPass = await createBycryptPassword(givenPassword);

  const isUserExist = await prisma.user.findUnique({
    where: { email: user.email },
  });

  // create data
  const dataToCreate: User = {
    password: genarateBycryptPass,
    ...rest,
    // only for super admin
    role:
      rest.email === config.mainAdminEmail
        ? UserRole.superAdmin
        : UserRole.user,
    isVerified: false,
    status:
      rest.email === config.mainAdminEmail
        ? EUserStatus.approved
        : EUserStatus.pending,
    isPaid: false,
    isChampion: false,
    isBlocked: false,
  };
  // if user and account exits
  if (isUserExist?.id && isUserExist.isVerified) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'User already exits');
  }

  const newUser = await prisma.$transaction(async tx => {
    // delete if all opt
    // if  user already exits but not verified
    if (isUserExist?.id && !isUserExist.isVerified) {
      // start new  transection  for new user
      await tx.verificationOtp.deleteMany({
        where: { ownById: isUserExist.id },
      });
      await tx.user.delete({ where: { id: isUserExist.id } });
    }

    const newUserInfo = await tx.user.create({
      data: dataToCreate,
    });
    // create new otp
    await tx.verificationOtp.create({
      data: {
        ownById: newUserInfo.id,
        otp: otp,
        type: EVerificationOtp.createUser,
      },
    });
    return newUserInfo;
  });
  if (!newUser?.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'failed to create user');
  }
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { password, id, email, name, ...others } = newUser;
  //create access token & refresh token
  const accessToken = jwtHelpers.createToken(
    { userId: id, role: newUser.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId: id, role: newUser.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    user: { email, id, name, ...others },
    accessToken,
    refreshToken,
    otp,
  };
  // eslint-disable-next-line no-unused-vars
};

const loginUser = async (payload: ILogin): Promise<ILoginResponse> => {
  const { email: givenEmail, password } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email: givenEmail },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  if (
    isUserExist.password &&
    !(await bcryptjs.compare(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token & refresh token
  const { email, id, role, name, ...others } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    user: { email, id, name, role, ...others },
    accessToken,
    refreshToken,
  };
};
const resendEmail = async (givenEmail: string): Promise<ILoginResponse> => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: givenEmail },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (isUserExist?.isVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already verified');
  }
  const otp = generateOTP();
  //create access token & refresh token
  const { email, id, role, name, ...others } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const verificationOtp = await prisma.$transaction(async tx => {
    await tx.verificationOtp.deleteMany({
      where: { ownById: isUserExist.id },
    });
    return await tx.verificationOtp.create({
      data: {
        ownById: isUserExist.id,
        otp: otp,
        type: EVerificationOtp.createUser,
      },
    });
  });
  if (!verificationOtp.id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot create verification Otp'
    );
  }
  const refreshToken = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.refresh_secret_signup as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    user: { email, id, name, role, ...others },
    accessToken,
    refreshToken: refreshToken,
    otp,
  };
};
const sendForgotEmail = async (
  givenEmail: string
): Promise<{ otp: number }> => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: givenEmail },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const otp = generateOTP();
  //create access token & refresh token
  const { email } = isUserExist;

  const verificationOtp = await prisma.$transaction(async tx => {
    await tx.verificationOtp.deleteMany({
      where: { ownById: isUserExist.id },
    });
    return await tx.verificationOtp.create({
      data: {
        ownById: isUserExist.id,
        otp: otp,
        type: EVerificationOtp.forgotPassword,
      },
    });
  });
  if (!verificationOtp.id) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Cannot create verification Otp'
    );
  }
  await sendEmail(
    { to: email },
    {
      subject: EmailTemplates.verify.subject,
      html: EmailTemplates.verify.html({ token: otp }),
    }
  );
  return {
    otp,
  };
};

const verifySignupToken = async (
  token: number,
  userId: string
): Promise<IVerifyTokeResponse> => {
  //verify token
  // invalid token - synchronous
  // checking deleted user's refresh token

  const isUserExist = await prisma.user.findUnique({ where: { id: userId } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // check is token match and valid
  const isTokenExit = await prisma.verificationOtp.findFirst({
    where: {
      ownById: userId,
      otp: token,
      type: EVerificationOtp.createUser,
    },
  });

  if (!isTokenExit) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OTP is not match');
  }

  // check time validation
  if (checkTimeOfOTP(isTokenExit.createdAt)) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OPT is expired!');
  }

  //generate new Access token

  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  // delete all otp
  await prisma.verificationOtp.deleteMany({
    where: { ownById: isUserExist.id },
  });
  const result = await UserService.updateUser(
    isUserExist.id,
    {
      isVerified: true,
    },
    {}
  );
  if (!result) {
    new ApiError(httpStatus.BAD_REQUEST, 'user not found');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { password, ...rest } = result as User;
  return {
    accessToken: newAccessToken,
    user: rest,
  };
};

const verifyForgotToken = async (
  token: number,
  userEmail: string
): Promise<{ token: number; isValidate: boolean }> => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: userEmail },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // check is token match and valid
  const isTokenExit = await prisma.verificationOtp.findFirst({
    where: {
      ownById: isUserExist.id,
      otp: token,
      type: EVerificationOtp.forgotPassword,
    },
  });

  if (!isTokenExit) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OTP is not match');
  }

  // check time validation
  if (checkTimeOfOTP(isTokenExit.createdAt)) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OPT is expired!');
  }

  // delete all otp
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  return {
    token,
    isValidate: true,
  };
};
const changePassword = async ({
  password,
  email,
  otp,
}: {
  password: string;
  email: string;
  otp: number;
}): Promise<ILoginResponse> => {
  // checking is user buyer
  // check is token match and valid

  const genarateBycryptPass = await createBycryptPassword(password);

  const isUserExist = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  const isTokenExit = await prisma.verificationOtp.findFirst({
    where: {
      ownById: isUserExist.id,
      otp,
      type: EVerificationOtp.forgotPassword,
    },
  });

  if (!isTokenExit) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OTP is not match');
  }
  if (checkTimeOfOTP(isTokenExit.createdAt)) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'OPT is expired!');
  }
  const result = await prisma.$transaction(async tx => {
    await tx.verificationOtp.deleteMany({
      where: {
        ownById: isUserExist.id,
      },
    });
    return await tx.user.update({
      where: { id: isUserExist.id },
      data: { password: genarateBycryptPass },
    });
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
  //create access token & refresh token
  const accessToken = jwtHelpers.createToken(
    { userId: isUserExist.id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId: isUserExist.id, role: isUserExist.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    user: result,
    accessToken,
    refreshToken,
    otp,
  };
  // eslint-disable-next-line no-unused-vars
};
const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { id } = verifiedToken;
  // checking deleted user's refresh token

  const isUserExist = await prisma.user.findFirst({ where: { id } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new Access token

  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
  verifySignupToken,
  resendEmail,
  sendForgotEmail,
  verifyForgotToken,
  changePassword,
};
