import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"

// Регистрируем кастомную сортировку для Explorer
ExternalPlugin.Explorer({
  sortFn: (a, b) => {
    // 1. Сначала файлы, потом папки
    if (a.file && !b.file) return -1
    if (!a.file && b.file) return 1

    // 2. Файлы (и в корне, и внутри папок) — по noteOrder
    if (a.file && b.file) {
      const orderA = a.file.frontmatter?.noteOrder ?? Infinity
      const orderB = b.file.frontmatter?.noteOrder ?? Infinity
      if (orderA !== orderB) return orderA - orderB
      // Если noteOrder не задан или равен — по алфавиту (имя файла)
      return a.displayName.localeCompare(b.displayName)
    }

    // 3. Папки — по folderOrder
    if (!a.file && !b.file) {
      const orderA = a.frontmatter?.folderOrder ?? Infinity
      const orderB = b.frontmatter?.folderOrder ?? Infinity
      if (orderA !== orderB) return orderA - orderB
      // Если folderOrder не задан или равен — по алфавиту (имя папки)
      return a.displayName.localeCompare(b.displayName)
    }

    return 0
  },
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
