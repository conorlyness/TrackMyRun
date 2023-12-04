import { Pipe, PipeTransform } from '@angular/core';

const ordinals: string[] = ['th', 'st', 'nd', 'rd'];

@Pipe({
  name: 'ordinal',
})
export class OrdinalPipe implements PipeTransform {
  transform(value: number | string | null): string {
    if (value === null || value === undefined) {
      return ''; // or handle appropriately for your use case
    }

    const numberValue = Number(value);

    if (isNaN(numberValue)) {
      return ''; // or handle appropriately for your use case
    }

    const modValue = numberValue % 100;
    return (
      numberValue +
      (ordinals[(modValue - 20) % 10] || ordinals[modValue] || ordinals[0])
    );
  }
}
