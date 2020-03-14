import { format } from 'date-fns';

export default function (dateToFormat) {
  return format(new Date(dateToFormat), "yyyy-MM-dd'T'HH:mm");
}
