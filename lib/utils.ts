// Simple utility to join class names conditionally
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// Generate unique ID
export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}
