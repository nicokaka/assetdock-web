import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [localValue, value, onChange])

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-9 bg-background/50"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
    </div>
  )
}
