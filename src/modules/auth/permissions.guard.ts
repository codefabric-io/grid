import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger('PermissionsGuard');

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.acl) {
      this.logger.warn(`Permission denied: User is missing ACL data`);
      return false;
    }

    // ✅ Convert ACL to a Map for faster lookups
    const aclMap = this.buildAclMap(user.acl);

    // ✅ Check if the user has at least one required permission
    const hasPermission = requiredPermissions.some((requiredPermission) =>
      this.checkPermission(aclMap, requiredPermission)
    );

    if (!hasPermission) {
      this.logger.warn(
        `Permission denied: User ${user?.email} (Roles: ${user?.roles?.join(', ')}) tried to access ${request.method} ${request.originalUrl}. Required: ${requiredPermissions.join(', ')}`
      );
    }

    return hasPermission;
  }

  private buildAclMap(aclEntries: any[]): Map<string, Set<string>> {
    const aclMap = new Map<string, Set<string>>();

    for (const entry of aclEntries) {
      for (const action of entry.actions) {
        const [method, path] = this.splitAction(action);
        if (!aclMap.has(path)) {
          aclMap.set(path, new Set());
        }
        aclMap.get(path)?.add(method);
      }
    }

    return aclMap;
  }

  private checkPermission(aclMap: Map<string, Set<string>>, requiredPermission: string): boolean {
    const [requiredMethod, requiredPath] = this.splitAction(requiredPermission);

    // ✅ Check for full access (* *)
    if (aclMap.has('*') && aclMap.get('*')?.has('*')) {
      return true;
    }

    // ✅ Check for exact match
    if (aclMap.has(requiredPath) && (aclMap.get(requiredPath)?.has('*') || aclMap.get(requiredPath)?.has(requiredMethod))) {
      return true;
    }

    // ✅ Check for wildcard paths
    for (const [aclPath, methods] of aclMap) {
      if (this.matchPath(aclPath, requiredPath) && (methods.has('*') || methods.has(requiredMethod))) {
        return true;
      }
    }

    return false;
  }

  private splitAction(action: string): [string, string] {
    const parts = action.split(' ');
    if (parts.length < 2) return ['*', action]; // Handle non-method permissions
    return [parts[0], parts.slice(1).join(' ')];
  }

  private matchPath(aclPath: string, requiredPath: string): boolean {
    // Convert wildcards and parameters into regex
    const regexPath = aclPath.replace(/:[^/]+/g, '[^/]+').replace(/\*/g, '.*');
    return new RegExp(`^${regexPath}$`).test(requiredPath);
  }
}
