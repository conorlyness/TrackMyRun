import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'month',
})
export class MonthPipe implements PipeTransform {
  transform(monthNumber: number): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Adjust the index if monthNumber is 1-indexed
    const index = monthNumber - 1;

    return months[index] || '';
  }
}
