import { startOfDay, subDays } from 'date-fns';

export const startDay = startOfDay(subDays(new Date(), 4));
