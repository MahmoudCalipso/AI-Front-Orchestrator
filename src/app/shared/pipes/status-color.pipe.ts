import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'statusColor',
    standalone: true
})
export class StatusColorPipe implements PipeTransform {
    transform(status: string | undefined | null): string {
        if (!status) {
            return 'default';
        }

        const normalizedStatus = status.toLowerCase();

        switch (normalizedStatus) {
            case 'success':
            case 'completed':
            case 'active':
            case 'online':
            case 'ready':
            case 'pass':
            case 'passed':
            case 'ok':
                return 'success';

            case 'error':
            case 'failed':
            case 'inactive':
            case 'offline':
            case 'critical':
            case 'blocked':
                return 'error';

            case 'warning':
            case 'pending':
            case 'inprogress':
            case 'running':
            case 'waiting':
            case 'medium':
                return 'warning';

            case 'info':
            case 'draft':
            case 'low':
                return 'info';

            default:
                return 'default';
        }
    }
}
