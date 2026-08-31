export const linkHealthStatuses = ["healthy", "blocked", "unavailable", "inconclusive", "not_checked"];

export function classifyLinkResult({ httpStatus = null, error = "" } = {}) {
  if (error) return /ENOTFOUND|ECONNREFUSED/i.test(error) ? "unavailable" : "inconclusive";
  if (httpStatus >= 200 && httpStatus < 400) return "healthy";
  if ([401, 403, 405, 412, 429].includes(httpStatus)) return "blocked";
  return "unavailable";
}

export function summarizeLinkHealth(items) {
  const counts = Object.fromEntries(linkHealthStatuses.map((status) => [status, 0]));
  for (const item of items) counts[linkHealthStatuses.includes(item.status) ? item.status : "not_checked"] += 1;
  const checked = counts.healthy + counts.blocked + counts.unavailable + counts.inconclusive;
  const decisive = counts.healthy + counts.blocked + counts.unavailable;
  const reachable = counts.healthy + counts.blocked;
  return {
    total: items.length,
    checked,
    decisive,
    reachable,
    healthy: counts.healthy,
    blocked: counts.blocked,
    unavailable: counts.unavailable,
    inconclusive: counts.inconclusive,
    unchecked: counts.not_checked,
    coverageRate: percentage(checked, items.length),
    availabilityRate: percentage(reachable, decisive)
  };
}

export function validateLinkHealthReport(report) {
  const errors = [];
  if (report?.schemaVersion !== 1) errors.push("link-health.schemaVersion 应为 1");
  if (!Array.isArray(report?.items)) errors.push("link-health.items 必须为数组");
  for (const [index, item] of (report?.items || []).entries()) {
    if (!String(item.url || "").startsWith("https://")) errors.push(`link-health.items[${index}].url 必须为 HTTPS`);
    if (!linkHealthStatuses.includes(item.status)) errors.push(`link-health.items[${index}].status 无效`);
    if (!Array.isArray(item.recordIds) || !item.recordIds.length) errors.push(`link-health.items[${index}].recordIds 缺失`);
  }
  return errors;
}

function percentage(value, total) {
  return total ? Number((value / total * 100).toFixed(1)) : null;
}
