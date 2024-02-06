import { User, UserRole } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import createBycryptPassword from '../../../helpers/createBycryptPassword';
import createNowPayInvoice from '../../../helpers/creeateInvoice';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { initiatePayment } from '../../../helpers/paystackPayment';
import { EPaymentType } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { UserService } from '../user/user.service';
import {
  ILogin,
  ILoginResponse,
  IRefreshTokenResponse,
  IVerifyTokeResponse,
} from './auth.Interface';
const createUser = async (
  user: User,
  paymentWithPaystack?: boolean
): Promise<ILoginResponse> => {
  // checking is user buyer
  const { password: givenPassword, ...rest } = user;
  let newUser;
  const isUserExist = await prisma.user.findUnique({
    where: { email: user.email },
  });
  // if user and account exits
  if (isUserExist?.id && isUserExist.role === UserRole.user) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'User already exits');
  }
  // if seller and already exist
  if (isUserExist?.id && isUserExist.role === UserRole.seller) {
    // user all ready paid
    if (isUserExist.isApprovedForSeller) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Seller already Exits ');
    } else {
      // seller account created but not paid , will let tme update and create it
      const genarateBycryptPass = await createBycryptPassword(givenPassword);

      // start new  transection  for new user
      // delete that user
      await UserService.deleteUser(isUserExist.id);

      // start new  transection  for new user
      newUser = await prisma.$transaction(async tx => {
        let role: UserRole =
          user.role === UserRole.seller ? UserRole.seller : UserRole.user;
        //gard for making super admin
        if (isUserExist?.email === config.mainAdminEmail) {
          role = UserRole.superAdmin;
        }

        const newUserInfo = await tx.user.create({
          data: {
            password: genarateBycryptPass,
            ...rest,
            role,
            isVerified: false,
            isApprovedForSeller: false,
          },
        });
        await tx.currency.create({
          data: {
            amount: 0,
            ownById: newUserInfo.id,
          },
        });

        // is is it seller
        if (newUserInfo.role !== UserRole.seller) {
          return newUserInfo;
        }
        if (paymentWithPaystack) {
          // pay stack
          const request = await initiatePayment(
            config.sellerOneTimePayment,
            newUserInfo.email,
            newUserInfo.id,
            EPaymentType.seller,
            config.frontendUrl + `/verify?toEmail=${newUserInfo.email}`
          );
          const updateUser = tx.user.update({
            where: { id: newUserInfo.id },
            data: { txId: request.data.authorization_url || '' },
          });
          return updateUser;
        } else {
          // now payment
          const data = await createNowPayInvoice({
            price_amount: config.sellerOneTimePayment,
            order_id: newUserInfo.id,
            ipn_callback_url: '/users/nowpayments-ipn',
            order_description: 'Creating Seller Account',
            success_url:
              config.frontendUrl + `/verify?toEmail=${newUserInfo.email}`,
            cancel_url: config.frontendUrl || '',
          });
          // newUser.txId=data.invoice_url;

          const updateUser = tx.user.update({
            where: { id: newUserInfo.id },
            data: { txId: data.invoice_url },
          });
          return updateUser;
        }
      });
    }
  } else {
    const genarateBycryptPass = await createBycryptPassword(givenPassword);

    // start new  transection  for new user
    newUser = await prisma.$transaction(async tx => {
      let role: UserRole =
        user.role === UserRole.seller ? UserRole.seller : UserRole.user;
      //gard for making super admin
      if (isUserExist?.email === config.mainAdminEmail) {
        role = UserRole.superAdmin;
      }

      const newUserInfo = await tx.user.create({
        data: {
          password: genarateBycryptPass,
          ...rest,
          role,
          isVerified: false,
          isApprovedForSeller: false,
        },
      });
      await tx.currency.create({
        data: {
          amount: 0,
          ownById: newUserInfo.id,
        },
      });

      // is is it seller
      if (newUserInfo.role !== UserRole.seller) {
        return newUserInfo;
      }
      if (paymentWithPaystack) {
        // pay stack
        const request = await initiatePayment(
          config.sellerOneTimePayment,
          newUserInfo.email,
          newUserInfo.id,
          EPaymentType.seller,
          config.frontendUrl + `/verify?toEmail=${newUserInfo.email}`
        );
        const updateUser = tx.user.update({
          where: { id: newUserInfo.id },
          data: { txId: request.data.authorization_url || '' },
        });
        return updateUser;
      } else {
        // now payment
        const data = await createNowPayInvoice({
          price_amount: config.sellerOneTimePayment,
          order_id: newUserInfo.id,
          ipn_callback_url: '/users/nowpayments-ipn',
          order_description: 'Creating Seller Account',
          success_url:
            config.frontendUrl + `/verify?toEmail=${newUserInfo.email}`,
          cancel_url: config.frontendUrl || '',
        });
        // newUser.txId=data.invoice_url;

        const updateUser = tx.user.update({
          where: { id: newUserInfo.id },
          data: { txId: data.invoice_url },
        });
        return updateUser;
      }
    });
  }

  if (!newUser) {
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
  const refreshTokenSignup = jwtHelpers.createToken(
    { userId: id, role: newUser.role },
    config.jwt.refresh_secret_signup as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    user: { email, id, name, ...others },
    accessToken,
    refreshToken,
    refreshTokenSignup,
  };
  // eslint-disable-next-line no-unused-vars
};

const loginUser = async (payload: ILogin): Promise<ILoginResponse> => {
  const { email: givenEmail, password } = payload;
  console.log(givenEmail);
  const isUserExist = await prisma.user.findFirst({
    where: { email: givenEmail },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  if (isUserExist.role === UserRole.seller) {
    if (isUserExist.isApprovedForSeller === false) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Seller does not exits');
    }
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
  const isUserExist = await prisma.user.findFirst({
    where: { email: givenEmail },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (isUserExist?.isVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already verified');
  }

  //create access token & refresh token
  const { email, id, role, name, ...others } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshTokenSignUp = jwtHelpers.createToken(
    { userId: id, role },
    config.jwt.refresh_secret_signup as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    user: { email, id, name, role, ...others },
    accessToken,
    refreshToken: refreshTokenSignUp,
  };
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
const verifySignupToken = async (
  token: string
): Promise<IVerifyTokeResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret_signup as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userId } = verifiedToken;
  // checking deleted user's refresh token
  console.log('the token', userId);

  const isUserExist = await prisma.user.findUnique({ where: { id: userId } });
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

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
  verifySignupToken,
  resendEmail,
};
