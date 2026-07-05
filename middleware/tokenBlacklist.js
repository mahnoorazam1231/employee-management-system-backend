/**
 * Simple in-memory JWT blacklist to support a "logout" endpoint.
 *
 * JWTs are stateless by design, so the only way to truly invalidate
 * one before it expires is to track it server-side. This in-memory
 * Set is fine for a single-instance dev/demo deployment. For a
 * production, multi-instance deployment, swap this for a shared
 * store such as Redis (e.g. SET key=token EX <secondsUntilExpiry>).
 */
const blacklist = new Set();

const addToBlacklist = (token) => blacklist.add(token);

const isBlacklisted = (token) => blacklist.has(token);

module.exports = { addToBlacklist, isBlacklisted };
