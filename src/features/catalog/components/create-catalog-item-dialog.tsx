import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateCatalogItemMutation, type CatalogType } from '@/features/catalog/hooks/use-create-catalog-item'

type CreateCatalogItemDialogProps = {
  type: CatalogType
  onSuccess?: (id: string) => void
}

export function CreateCatalogItemDialog({ type, onSuccess }: CreateCatalogItemDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const mutation = useCreateCatalogItemMutation(type)

  const titles = {
    category: t('catalog.newCategory', 'New Category'),
    manufacturer: t('catalog.newManufacturer', 'New Manufacturer'),
    location: t('catalog.newLocation', 'New Location'),
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setName('')
      setDescription('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      const result = await mutation.mutateAsync({ name, description })
      if (onSuccess) {
        onSuccess(result.id)
      }
      handleOpenChange(false)
    } catch {
      // Handled by hook onError toast
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" type="button">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add new</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{titles[type]}</DialogTitle>
            <DialogDescription>
              {t('catalog.newDescription', 'Fill out the details below to add a new option.')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('catalog.nameLabel', 'Name')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                placeholder={t('catalog.namePlaceholder', 'e.g. IT Equipment')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('catalog.descriptionLabel', 'Description')} ({t('common.optional', 'Optional')})</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={!name.trim() || mutation.isPending}>
              {mutation.isPending ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
