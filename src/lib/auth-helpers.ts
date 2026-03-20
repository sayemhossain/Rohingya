import { getServerSession as nextAuthGetServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getServerSession() {
  return await nextAuthGetServerSession(authOptions);
}

export async function requireAuth(requiredRole?: string) {
  const session = await getServerSession();

  if (!session) {
    throw new Error('Unauthorized: You must be logged in to access this resource');
  }

  if (requiredRole && session.user.role !== requiredRole) {
    throw new Error('Forbidden: You do not have permission to access this resource');
  }

  return session;
}

export async function requireAdmin() {
  const session = await getServerSession();

  if (!session) {
    throw new Error('Unauthorized: You must be logged in to access this resource');
  }

  if (session.user.role !== 'admin' && session.user.role !== 'superadmin') {
    throw new Error('Forbidden: Admin access required');
  }

  return session;
}

export async function requireSuperAdmin() {
  const session = await getServerSession();

  if (!session) {
    throw new Error('Unauthorized: You must be logged in to access this resource');
  }

  if (session.user.role !== 'superadmin') {
    throw new Error('Forbidden: Super admin access required');
  }

  return session;
}
