import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { Info, PlusCircle, ArrowUpRight, ArrowDownRight, Edit, Settings } from 'lucide-react'
import type { TimelineEvent } from '../hooks/use-asset-timeline'
import { useAssetTimeline } from '../hooks/use-asset-timeline'

interface AssetTimelineProps {
  assetId: string
}

const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case 'ASSET_CREATED':
      return <PlusCircle className="h-4 w-4 text-green-500" />
    case 'ASSET_UPDATED':
      return <Edit className="h-4 w-4 text-blue-500" />
    case 'ASSET_CHECKED_OUT':
    case 'ASSET_ASSIGNED':
      return <ArrowUpRight className="h-4 w-4 text-amber-500" />
    case 'ASSET_CHECKED_IN':
    case 'ASSET_UNASSIGNED':
      return <ArrowDownRight className="h-4 w-4 text-emerald-500" />
    case 'ASSET_ARCHIVED':
      return <Settings className="h-4 w-4 text-gray-500" />
    default:
      return <Info className="h-4 w-4 text-gray-500" />
  }
}

const getEventDescription = (event: TimelineEvent, t: TFunction) => {
  switch (event.eventType) {
    case 'ASSET_CREATED':
      return t('app.timeline.created', 'Asset was created')
    case 'ASSET_UPDATED':
      return t('app.timeline.updated', 'Asset details were updated')
    case 'ASSET_CHECKED_OUT':
      return t('app.timeline.checkedOut', 'Asset was checked out')
    case 'ASSET_CHECKED_IN':
      return t('app.timeline.checkedIn', 'Asset was checked in')
    case 'ASSET_ASSIGNED':
      return t('app.timeline.assigned', 'Asset was assigned to a user')
    case 'ASSET_UNASSIGNED':
      return t('app.timeline.unassigned', 'Asset was unassigned')
    case 'ASSET_ARCHIVED':
      return t('app.timeline.archived', 'Asset was archived')
    default:
      return event.eventType.replace(/_/g, ' ')
  }
}

export function AssetTimeline({ assetId }: AssetTimelineProps) {
  const { t } = useTranslation()
  const { data: events, isLoading, isError } = useAssetTimeline(assetId)

  if (isLoading) {
    return <div className="text-sm text-muted-foreground p-4 text-center">{t('common.loading', 'Loading...')}</div>
  }

  if (isError) {
    return <div className="text-sm text-destructive p-4 text-center">{t('app.timeline.error', 'Unable to load timeline')}</div>
  }

  if (!events || events.length === 0) {
    return <div className="text-sm text-muted-foreground p-4 text-center">{t('app.timeline.empty', 'No timeline events found')}</div>
  }

  return (
    <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {events.map((event) => (
        <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 dark:bg-slate-800 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            {getEventIcon(event.eventType)}
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold">{getEventDescription(event, t)}</h4>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(event.occurredAt).toLocaleString()}
                </span>
              </div>
              {event.details && Object.keys(event.details).length > 0 && (
                <div className="mt-2 text-xs bg-muted/50 p-2 rounded text-muted-foreground">
                  <pre className="whitespace-pre-wrap font-sans">{JSON.stringify(event.details, null, 2).replace(/[{}""]/g, '')}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
