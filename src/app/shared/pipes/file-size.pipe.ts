import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fileSize',
    standalone: true
})
export class FileSizePipe implements PipeTransform {
    transform(bytes: number | undefined | null, precision: number = 2): string {
        if (bytes === undefined || bytes === null || isNaN(bytes)) {
            return '';
        }
        if (bytes === 0) {
            return '0 B';
        }

        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(precision)) + ' ' + units[i];
    }
}
