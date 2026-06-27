/**
 * Generate a unique participant ID.
 * Format: GM-YYYYMMDD-XXX (e.g., GM-20260513-001)
 * The counter part is fetched from the database to ensure uniqueness.
 */

export function generateParticipantId(todayCount) {
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  const counter = (todayCount + 1).toString().padStart(3, '0');
  return `GM-${dateStr}-${counter}`;
}
