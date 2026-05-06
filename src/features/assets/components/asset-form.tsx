import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  useCategoriesQuery,
  useLocationsQuery,
  useManufacturersQuery,
} from '@/features/catalog/hooks/use-catalog-lookups'
import {
  assetFormSchema,
  type AssetFormValues,
} from '@/features/assets/types/asset-form'
import { getLookupStateMessage } from '@/lib/format'
import { CreateCatalogItemDialog } from '@/features/catalog/components/create-catalog-item-dialog'

type AssetFormProps = {
  defaultValues: AssetFormValues
  submitLabel: string
  pendingLabel: string
  isPending: boolean
  errorMessage?: string
  onSubmit: (values: AssetFormValues) => Promise<void>
}



export function AssetForm({
  defaultValues,
  submitLabel,
  pendingLabel,
  isPending,
  errorMessage,
  onSubmit,
}: AssetFormProps) {
  const { t } = useTranslation()
  const categoriesQuery = useCategoriesQuery()
  const manufacturersQuery = useManufacturersQuery()
  const locationsQuery = useLocationsQuery()
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues,
  })

  const categories = categoriesQuery.data?.filter((item) => item.active) ?? []
  const manufacturers = manufacturersQuery.data?.filter((item) => item.active) ?? []
  const locations = locationsQuery.data?.filter((item) => item.active) ?? []

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="assetTag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('assetForm.labels.assetTag', 'Asset tag')}</FormLabel>
              <FormControl>
                <Input placeholder={t('assetForm.placeholders.assetTag', 'e.g. AST-001')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('assetForm.labels.displayName', 'Display name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('assetForm.placeholders.displayName', 'e.g. MacBook Pro 14')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="serialNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('assetForm.labels.serialNumber', 'Serial number')}</FormLabel>
              <FormControl>
                <Input placeholder={t('assetForm.placeholders.serialNumber', 'e.g. C02XXXXXXX')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('assetForm.labels.category', 'Category')}</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <select
                    {...field}
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="">
                      {getLookupStateMessage(
                        categoriesQuery.isPending,
                        categoriesQuery.isError,
                        t('assetForm.placeholders.noCategory', 'No category')
                      )}
                    </option>
                    {categories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <CreateCatalogItemDialog type="category" onSuccess={(id) => form.setValue('categoryId', id)} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="manufacturerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('assetForm.labels.manufacturer', 'Manufacturer')}</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <select
                    {...field}
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="">
                      {getLookupStateMessage(
                        manufacturersQuery.isPending,
                        manufacturersQuery.isError,
                        t('assetForm.placeholders.noManufacturer', 'No manufacturer')
                      )}
                    </option>
                    {manufacturers.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <CreateCatalogItemDialog type="manufacturer" onSuccess={(id) => form.setValue('manufacturerId', id)} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hostname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('assetForm.labels.hostname', 'Hostname')}</FormLabel>
              <FormControl>
                <Input placeholder={t('assetForm.placeholders.hostname', 'e.g. assetdock-mbp-14')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currentLocationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('assetForm.labels.location', 'Location')}</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <select
                    {...field}
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="">
                      {getLookupStateMessage(
                        locationsQuery.isPending,
                        locationsQuery.isError,
                        t('assetForm.placeholders.noLocation', 'No location')
                      )}
                    </option>
                    {locations.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <CreateCatalogItemDialog type="location" onSuccess={(id) => form.setValue('currentLocationId', id)} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('assetForm.labels.description', 'Description')}</FormLabel>
              <FormControl>
                <Textarea placeholder={t('assetForm.placeholders.description', 'Any additional information...')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </form>
    </Form>
  )
}
