import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

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
import {
  useCategoriesQuery,
  useLocationsQuery,
  useManufacturersQuery,
} from '@/features/catalog/hooks/use-catalog-lookups'
import { useCreateAssetMutation } from '@/features/assets/hooks/use-create-asset'
import { HttpError } from '@/lib/http-client'

const optionalUuidField = z.union([z.uuid('Select a valid option.'), z.literal('')])

const assetCreateSchema = z.object({
  assetTag: z.string().trim().min(1, 'Asset tag is required.'),
  displayName: z.string().trim().min(1, 'Display name is required.'),
  serialNumber: z.string().trim().optional(),
  hostname: z.string().trim().optional(),
  description: z.string().trim().optional(),
  categoryId: optionalUuidField,
  manufacturerId: optionalUuidField,
  currentLocationId: optionalUuidField,
})

type AssetCreateFormValues = z.infer<typeof assetCreateSchema>

function optionalValue(value: string | undefined) {
  return value ? value : undefined
}

function getLookupStateMessage(isPending: boolean, isError: boolean, emptyLabel: string) {
  if (isPending) {
    return 'Loading...'
  }

  if (isError) {
    return 'Unavailable'
  }

  return emptyLabel
}

export function AssetCreateForm() {
  const navigate = useNavigate()
  const createAssetMutation = useCreateAssetMutation()
  const categoriesQuery = useCategoriesQuery()
  const manufacturersQuery = useManufacturersQuery()
  const locationsQuery = useLocationsQuery()
  const form = useForm<AssetCreateFormValues>({
    resolver: zodResolver(assetCreateSchema),
    defaultValues: {
      assetTag: '',
      displayName: '',
      serialNumber: '',
      hostname: '',
      description: '',
      categoryId: '',
      manufacturerId: '',
      currentLocationId: '',
    },
  })

  const categories = categoriesQuery.data?.filter((item) => item.active) ?? []
  const manufacturers = manufacturersQuery.data?.filter((item) => item.active) ?? []
  const locations = locationsQuery.data?.filter((item) => item.active) ?? []

  async function onSubmit(values: AssetCreateFormValues) {
    form.clearErrors('root')

    try {
      const asset = await createAssetMutation.mutateAsync({
        assetTag: values.assetTag,
        displayName: values.displayName,
        serialNumber: optionalValue(values.serialNumber),
        hostname: optionalValue(values.hostname),
        description: optionalValue(values.description),
        categoryId: optionalValue(values.categoryId),
        manufacturerId: optionalValue(values.manufacturerId),
        currentLocationId: optionalValue(values.currentLocationId),
      })

      navigate(`/app/assets/${asset.id}`, { replace: true })
    } catch (error) {
      const message =
        error instanceof HttpError && error.status === 400
          ? 'Unable to create the asset with the provided data.'
          : 'Unable to create the asset right now.'

      form.setError('root', { message })
    }
  }

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
                <Input placeholder="Primary engineering laptop" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root?.message ? (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        ) : null}
        <Button type="submit" disabled={createAssetMutation.isPending}>
          {createAssetMutation.isPending ? 'Creating...' : 'Create asset'}
        </Button>
      </form>
    </Form>
  )
}
