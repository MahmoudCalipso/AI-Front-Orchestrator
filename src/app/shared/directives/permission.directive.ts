import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/api/auth.service';
import { Subscription } from 'rxjs';
import { UserInfo } from '../../core/models/auth/auth.model';

@Directive({
    selector: '[appPermission]',
    standalone: true
})
export class PermissionDirective implements OnInit, OnDestroy {
    @Input() appPermission: string | string[] = [];

    private userSubscription?: Subscription;
    private currentUser: UserInfo | null = null;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.userSubscription = this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
            this.updateView();
        });
    }

    ngOnDestroy() {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    private updateView() {
        this.viewContainer.clear();

        if (this.checkPermission()) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }

    private checkPermission(): boolean {
        if (!this.currentUser) {
            return false;
        }

        if (!this.appPermission || this.appPermission.length === 0) {
            return true;
        }

        const requiredRoles = Array.isArray(this.appPermission)
            ? this.appPermission
            : [this.appPermission];

        // Assuming user has a 'role' property. Adjust based on exact UserInfo model.
        // If roles is an array in UserInfo:
        return requiredRoles.some(role => this.currentUser?.roles.includes(role));

        // If role is a string:
        // return requiredRoles.includes(this.currentUser.role || '');
    }
}
