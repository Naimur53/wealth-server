import { CrowdFund, Flipping, Property } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

function findUniqueEntity(
  refName: string,
  ids: {
    propertyId?: string;
    crowdFundId?: string;
    flippingId?: string;
  }
): Promise<CrowdFund | Flipping | Property | null> {
  // const id = as string
  if (refName === 'crowdFund') {
    return prisma.crowdFund.findUnique({ where: { id: ids[`${refName}Id`] } });
  } else if (refName === 'flipping') {
    return prisma.flipping.findUnique({ where: { id: ids[`${refName}Id`] } });
  } else if (refName === 'property') {
    return prisma.property.findUnique({ where: { id: ids[`${refName}Id`] } });
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid refName');
  }
}

export const multiHandler = { findUniqueEntity };
