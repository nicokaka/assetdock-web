import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Monitor, User, Loader2 } from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useGlobalSearch } from '@/features/search/hooks/use-search'
import { useDebounce } from '@/hooks/use-debounce'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const navigate = useNavigate()

  const { data, isFetching } = useGlobalSearch(debouncedQuery)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Type a command or search..." 
        value={query} 
        onValueChange={setQuery} 
      />
      <CommandList>
        <CommandEmpty>
          {isFetching ? (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : (
            'No results found.'
          )}
        </CommandEmpty>

        {data?.assets && data.assets.length > 0 && (
          <CommandGroup heading="Assets">
            {data.assets.map((asset) => (
              <CommandItem
                key={asset.id}
                value={asset.title + ' ' + asset.subtitle}
                onSelect={() => runCommand(() => navigate(asset.urlPath))}
              >
                <Monitor className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span>{asset.title}</span>
                  <span className="text-xs text-muted-foreground">{asset.subtitle}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {data?.users && data.users.length > 0 && (
          <CommandGroup heading="Users">
            {data.users.map((user) => (
              <CommandItem
                key={user.id}
                value={user.title + ' ' + user.subtitle}
                onSelect={() => runCommand(() => navigate(user.urlPath))}
              >
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span>{user.title}</span>
                  <span className="text-xs text-muted-foreground">{user.subtitle}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
