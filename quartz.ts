import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import Explorer from "./quartz/components/Explorer"

// 1. Создаем кастомную функцию сортировки
const customSortFn = (a: any, b: any) => {
  // Извлекаем порядок из frontmatter. Для папок используем folderOrder, для заметок — noteOrder.
  // Данные поля должны быть добавлены в contentIndex вашим доработанным плагином.
  const aOrder = a.isFolder
    ? a.data?.frontmatter?.folderOrder
    : a.data?.frontmatter?.noteOrder
  const bOrder = b.isFolder
    ? b.data?.frontmatter?.folderOrder
    : b.data?.frontmatter?.noteOrder

  // Если у обоих элементов задан числовой порядок — сортируем по нему (по возрастанию)
  if (typeof aOrder === "number" && typeof bOrder === "number") {
    return aOrder - bOrder
  }
  
  // Элементы с заданным порядком всегда идут перед теми, у кого его нет
  if (typeof aOrder === "number") return -1
  if (typeof bOrder === "number") return 1

  // Стандартная сортировка, если порядок не задан: 
  // сначала папки, затем файлы, внутри групп — по алфавиту
  if (a.isFolder && !b.isFolder) return -1
  if (!a.isFolder && b.isFolder) return 1
  return a.displayName.localeCompare(b.displayName, undefined, {
    numeric: true,
    sensitivity: "base",
  })
}

// 2. Загружаем конфигурацию и лейаут из YAML
const config = await loadQuartzConfig()
const layout = await loadQuartzLayout()

// 3. Вспомогательная функция для замены Explorer в массивах компонентов
function overrideExplorer(components: any[]) {
  if (!Array.isArray(components)) return components
  return components.map((component) => {
    // Проверяем, является ли компонент Explorer'ом
    if (component && (component.name === "Explorer" || component.displayName === "Explorer")) {
      // Возвращаем новый экземпляр Explorer с нашей функцией сортировки
      return Explorer({ sortFn: customSortFn })
    }
    return component
  })
}

// 4. Применяем переопределение ко всем возможным секциям лейаута
if (layout.left) layout.left = overrideExplorer(layout.left)
if (layout.right) layout.right = overrideExplorer(layout.right)
if (layout.beforeBody) layout.beforeBody = overrideExplorer(layout.beforeBody)
if (layout.afterBody) layout.afterBody = overrideExplorer(layout.afterBody)

// 5. Экспортируем модифицированные конфигурацию и лейаут
export default config
export { layout }
