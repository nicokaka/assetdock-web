import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

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
              <FormLabel>Asset tag</FormLabel>
              <FormControl>
                <Input placeholder="AST-001" {...field} />
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
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input placeholder="MacBook Pro 14" {...field} />
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
              <FormLabel>Serial number</FormLabel>
              <FormControl>
                <Input placeholder="C02XXXXXXX" {...field} />
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
              <FormLabel>Category</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="">
                    {getLookupStateMessage(
                      categoriesQuery.isPending,
                      categoriesQuery.isError,
                      'No category'
                    )}
                  </option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
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
              <FormLabel>Manufacturer</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="">
                    {getLookupStateMessage(
                      manufacturersQuery.isPending,
                      manufacturersQuery.isError,
                      'No manufacturer'
                    )}
                  </option>
                  {manufacturers.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
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
              <FormLabel>Hostname</FormLabel>
              <FormControl>
                <Input placeholder="assetdock-mbp-14" {...field} />
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
              <FormLabel>Location</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="">
                    {getLookupStateMessage(
                      locationsQuery.isPending,
                      locationsQuery.isError,
                      'No location'
                    )}
                  </option>
                  {locations.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Primary engineering laptop" {...field} />
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
