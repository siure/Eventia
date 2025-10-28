/**
 * Converts uptime (in seconds) into a status label.
 * @param {number} uptimeSec - The uptime in seconds.
 * @returns {string} One of "warming-up", "healthy", or "steady".
 * @throws {Error} If uptimeSec is negative or not a number.
 */
export function formatStatus(uptimeSec) {
  if (typeof uptimeSec !== "number" || isNaN(uptimeSec)) {
    throw new Error("uptime must be a number");
  }
  if (uptimeSec < 0) throw new Error("invalid uptime");
  if (uptimeSec < 60) return "warming-up";
  if (uptimeSec < 3600) return "healthy";
  return "steady";
}
