import { useEffect, useState } from 'react'
import { QrCode, Printer } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { httpClient } from '@/lib/http-client'

interface QrCodeViewerProps {
  assetId: string
  assetTag: string
}

export function QrCodeViewer({ assetId, assetTag }: QrCodeViewerProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

  const fetchQrCode = async () => {
    if (qrCodeUrl) return // already fetched

    setIsLoading(true)
    try {
      const blob = await httpClient.request<Blob>(`/assets/${assetId}/qr-code`, {
        method: 'GET',
        // Request as blob since it's an image
        responseType: 'blob',
      })
      const url = URL.createObjectURL(blob)
      setQrCodeUrl(url)
    } catch (error) {
      console.error('Failed to load QR Code', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      fetchQrCode()
    } else if (qrCodeUrl) {
      URL.revokeObjectURL(qrCodeUrl)
      setQrCodeUrl(null)
    }
  }

  useEffect(() => {
    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl)
      }
    }
  }, [qrCodeUrl])

  const downloadLabel = async () => {
    try {
      const blob = await httpClient.request<Blob>(`/assets/${assetId}/label`, {
        method: 'GET',
        responseType: 'blob',
      })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `label-${assetTag}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download Label PDF', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <QrCode className="h-4 w-4" />
          {t('app.assets.qrCode.viewButton', 'QR Code')}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('app.assets.qrCode.title', 'Asset QR Code')}</DialogTitle>
          <DialogDescription>
            {t('app.assets.qrCode.description', 'Scan this code to quickly access the asset details.')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-border/50">
            {isLoading ? (
              <div className="w-48 h-48 flex items-center justify-center text-muted-foreground animate-pulse">
                Loading...
              </div>
            ) : qrCodeUrl ? (
              <img src={qrCodeUrl} alt={`QR Code for ${assetTag}`} className="w-48 h-48" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-destructive">
                Failed to load
              </div>
            )}
          </div>
          <p className="text-sm font-medium">{assetTag}</p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t('common.close', 'Close')}
          </Button>
          <Button onClick={downloadLabel} className="gap-2">
            <Printer className="h-4 w-4" />
            {t('app.assets.qrCode.downloadLabel', 'Print Label (PDF)')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
