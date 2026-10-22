import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"

const getFrontmatterNumber = (
  node: { data?: { frontmatter?: Record<string, unknown> } | null },
  key: "noteOrder" | "folderOrder",
): number | undefined => {
  const value = node.data?.frontmatter?.[key]

  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return undefined
}

const getFallbackName = (node: { displayName?: string; slug?: string }) =>
  (node.displayName ?? node.slug ?? "").toLowerCase()

ExternalPlugin.Explorer({
  sortFn: (a, b) => {
    const aIsFolder = Boolean(a.isFolder)
    const bIsFolder = Boolean(b.isFolder)

    if (aIsFolder !== bIsFolder) {
      return aIsFolder ? 1 : -1
    }

    const aOrder = aIsFolder
      ? getFrontmatterNumber(a, "folderOrder")
      : getFrontmatterNumber(a, "noteOrder")
    const bOrder = bIsFolder
      ? getFrontmatterNumber(b, "folderOrder")
      : getFrontmatterNumber(b, "noteOrder")

    const aHasOrder = aOrder !== undefined
    const bHasOrder = bOrder !== undefined

    if (aHasOrder && bHasOrder) {
      if (aOrder !== bOrder) {
        return aOrder - bOrder
      }
    } else if (aHasOrder !== bHasOrder) {
      return aHasOrder ? -1 : 1
    }

    return getFallbackName(a).localeCompare(getFallbackName(b), undefined, {
      numeric: true,
      sensitivity: "base",
    })
  },
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
