import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"

ExternalPlugin.Explorer({
  sortFn: (a, b) => {
    // 1. Файлы выше папок
    if (a.file && !b.file) return -1
    if (!a.file && b.file) return 1

    // 2. Файлы (и в корне, и внутри папок) — по noteOrder
    if (a.file && b.file) {
      const orderA = a.file.frontmatter?.noteOrder ?? Infinity
      const orderB = b.file.frontmatter?.noteOrder ?? Infinity
      if (orderA !== orderB) return orderA - orderB
      return a.displayName.localeCompare(b.displayName)
    }

    // 3. Папки — по folderOrder (из их index.md)
    if (!a.file && !b.file) {
      const orderA = a.frontmatter?.folderOrder ?? Infinity
      const orderB = b.frontmatter?.folderOrder ?? Infinity
      if (orderA !== orderB) return orderA - orderB
      return a.displayName.localeCompare(b.displayName)
    }

    return 0
  },
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
