import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/api/auth.service';
import { map } from 'rxjs/operators';

/**
 * Role Guard
 * Protects routes based on user roles
 */
export const roleGuard: (requiredRoles: string[]) => CanActivateFn = (requiredRoles: string[]) => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
      map(user => {
        if (!user) {
          router.navigate(['/login'], {
            queryParams: { returnUrl: state.url }
          });
          return false;
        }

        const hasRole = requiredRoles.includes(user.role);

        if (!hasRole) {
          router.navigate(['/forbidden']);
          return false;
        }

        return true;
      })
    );
  };
};
