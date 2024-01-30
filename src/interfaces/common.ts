import { IGenericErrorMessage } from './error';

export type IGenericResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};
export type TAdminOverview = {
  totalAccount: number;
  totalSoldAccount: number;
  totalUser: number;
  totalEarning: number;
};
export type TSellerOverview = {
  totalAccount: number;
  totalSoldAccount: number;
  totalOrder: number;
  totalMoney: number;
};
export type TUserOverview = {
  totalAccountOnCart: number;
  totalOrder: number;
  totalMoney: number;
};
