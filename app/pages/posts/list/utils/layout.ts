import { breakpoints } from '@/utils/breakpoint';

const ITEM_MAX_WIDTH = 260;

export const useColumnNumber = (width: number): number => {
  if (width === 0) {
    return 0;
  }

  if (width < breakpoints.sm) {
    return 2;
  }

  return Math.floor(width / ITEM_MAX_WIDTH);
};
