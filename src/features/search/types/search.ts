export type SearchResultItem = {
  id: string
  title: string
  subtitle: string
  urlPath: string
}

export type GlobalSearchResult = {
  assets: SearchResultItem[]
  users: SearchResultItem[]
}
