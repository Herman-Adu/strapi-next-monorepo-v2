import { getAllDocs } from "@/lib/docs/loader"
import { DocsSidebarClient } from "./DocsSidebarClient"

export function DocsSidebar() {
  const allDocs = getAllDocs()
  return <DocsSidebarClient allDocs={allDocs} />
}
