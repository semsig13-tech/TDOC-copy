import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"

// Переопределяем функцию сортировки для Explorer через ExternalPlugin.
// Это правильный способ для Quartz v5, где компоненты доступны через плагины.
ExternalPlugin.Explorer({
  sortFn: (a, b) => {
    // 1. Извлекаем порядок из frontmatter.
    // Для папок используем folderOrder, для заметок — noteOrder.
    const aOrder = a.isFolder
      ? a.data?.frontmatter?.folderOrder
      : a.data?.frontmatter?.noteOrder
    const bOrder = b.isFolder
      ? b.data?.frontmatter?.folderOrder
      : b.data?.frontmatter?.noteOrder

    // 2. Если у обоих элементов задан числовой порядок — сортируем по нему.
    if (typeof aOrder === "number" && typeof bOrder === "number") {
      return aOrder - bOrder
    }
    // Элементы с заданным порядком всегда идут первыми.
    if (typeof aOrder === "number") return -1
    if (typeof bOrder === "number") return 1

    // 3. Стандартная сортировка, если порядок не задан:
    // сначала папки, затем файлы, внутри групп — по алфавиту.
    if (a.isFolder && !b.isFolder) return -1
    if (!a.isFolder && b.isFolder) return 1
    return a.displayName.localeCompare(b.displayName, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  },
})

// Загружаем конфигурацию и лейаут.
const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
