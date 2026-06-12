import { validateCatalog } from './catalog';

/** PR 校验入口:`pnpm --filter @asc/resource-library check`。有错则抛出(退出码非 0)。 */
const errors = validateCatalog();
if (errors.length > 0) {
  throw new Error(`资源库校验失败:\n${errors.map((e) => `  - ${e}`).join('\n')}`);
}
console.log('资源库校验通过 ✅');
