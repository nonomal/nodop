import { Client } from "@notionhq/client"
import { Page, PartialPage } from "./typing.js"
import cache from "../cache.js"

export const notion = new Client({ auth: process.env.NOTION_KEY })

export function eventsContainsOnly(events: Set<string>, ...types: string[]) {
  if (events === null) {
    return true
  }
  let hasOthers = false
  for (const event of events) {
    if (!types.includes(event)) {
      hasOthers = true
      break
    }
  }
  return !hasOthers
}

let lastTimestamp = cache.getLastTimestamp()
if (lastTimestamp === 0) {
  lastTimestamp = Date.now()
}

async function getLastISOTime() {
  const iso = new Date(lastTimestamp).toISOString()

  lastTimestamp = Date.now()
  await cache.setLastTimestamp(lastTimestamp)

  return iso
}

export async function getNewPagesFromDatabase(databaseId: string, events: Set<string> = null): Promise<Array<Page>> {
  // TODO: use an in-memory store to avoid duplicates

  let nextCursor: string | null | undefined = undefined
  let filter = null
  if (eventsContainsOnly(events, 'create', 'update')) {
    filter = {
      timestamp: 'last_edited_time',
      last_edited_time: {
        on_or_after: await getLastISOTime(),
      },
    }
  }

  const pages: Array<PartialPage> = []
  while (nextCursor !== null) {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter,
      start_cursor: nextCursor,
    })

    nextCursor = response.next_cursor
    pages.push(...response.results)
  }

  return pages.filter((page: PartialPage): page is Page => {
    return 'url' in page
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function setPageProperty(pageId: string, propertyName: string, value: any) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      [propertyName]: {
        select: {
          name: value,
        }
      }
    }
  })
}
