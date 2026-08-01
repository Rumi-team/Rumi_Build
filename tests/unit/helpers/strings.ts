/**
 * Every string reachable from a value, paired with the path that reaches it —
 * `data.ts.AI_EMPLOYEES[0].features[2]` style, so a failure names the offending
 * copy instead of just the module.
 *
 * Walking the VALUES (rather than the file text) is deliberate: source comments
 * in data.ts and i18n.tsx quote the banned words on purpose to explain the rule,
 * and those comments are not user-facing copy.
 */
export function collectStrings(node: unknown, path: string): [string, string][] {
  if (typeof node === "string") return [[path, node]];
  if (typeof node === "function") return [];
  if (Array.isArray(node)) {
    return node.flatMap((child, i) => collectStrings(child, `${path}[${i}]`));
  }
  if (node !== null && typeof node === "object") {
    return Object.entries(node as Record<string, unknown>).flatMap(([k, v]) =>
      collectStrings(v, path ? `${path}.${k}` : k)
    );
  }
  return [];
}
