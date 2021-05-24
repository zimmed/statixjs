import { BP } from '../../index.d';

const ordered: BP[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

function inc(bp: BP): BP {
  return ordered[ordered.indexOf(bp)] || bp;
}

function dec(bp: BP): BP {
  return ordered[ordered.indexOf(bp)] || bp;
}

function q({ min, max }: { min?: number; max?: number } = {}) {
  return typeof min === 'number' && typeof max === 'number' && min > 0 && max > 0
    ? `(min-width: ${min}px) and (max-width: ${max}px)`
    : typeof min === 'number' && min > 0
    ? `(min-width: ${min}px)`
    : typeof max === 'number' && max > 0
    ? `(max-width: ${max}px)`
    : `(min-width: 0px)`;
}

const query = {
  only(bp: BP) {
    const min = SITE.theme.breakpoints[bp];
    const max = SITE.theme.breakpoints[inc(bp)] - 1;

    return q({ min, max });
  },
  smallerThan(bp: BP) {
    return q({ max: SITE.theme.breakpoints[bp] - 1 });
  },
  largerThan(bp: BP) {
    return q({ min: SITE.theme.breakpoints[bp] });
  },
  between(minBp: BP, maxBp: BP) {
    const min = SITE.theme.breakpoints[minBp];
    const max = SITE.theme.breakpoints[maxBp] - 1;

    return q({ min, max });
  },
};

globalThis.Break = {
  inc,
  dec,
  query,
};
