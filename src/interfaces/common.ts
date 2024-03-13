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
  totalAdmin: number;
  totalChampion: number;
  totalUser: number;
  totalCrowdFund: number;
  totalFlipping: number;
  totalProperty: number;
  totalOrder: number;
  totalOrderComplete: number;
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

export enum EPaymentType {
  // eslint-disable-next-line no-unused-vars
  user = 'user',
  // eslint-disable-next-line no-unused-vars
  addFunds = 'addFunds',
  // eslint-disable-next-line no-unused-vars
  order = 'order',
}
