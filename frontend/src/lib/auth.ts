export type UserRole = 'lawyer' | 'citizen' | 'student' | 'police' | 'judge';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export const ROLES: { value: UserRole; label: string; icon: string; description: string }[] = [
  { value: 'lawyer', label: 'Lawyer', icon: '⚖️', description: 'Legal practitioner' },
  { value: 'citizen', label: 'Citizen', icon: '👤', description: 'General public' },
  { value: 'student', label: 'Student', icon: '📚', description: 'Law student' },
  { value: 'police', label: 'Police', icon: '🛡️', description: 'Law enforcement' },
  { value: 'judge', label: 'Judge', icon: '🏛️', description: 'Judicial officer' },
];

export function getUser(): User | null {
  const token = localStorage.getItem('alis_token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload as User;
  } catch {
    return null;
  }
}

export function createMockToken(user: Omit<User, 'id'>): string {
  const payload = { ...user, id: crypto.randomUUID(), exp: Date.now() + 86400000 };
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.mock-signature`;
}

export function logout() {
  localStorage.removeItem('alis_token');
  window.location.href = '/';
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}
