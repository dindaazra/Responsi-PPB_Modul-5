import { useState, useEffect } from 'react'
import { Download, WifiOff, X } from 'lucide-react'

export default function PWABadge() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    const onAppInstalled = () => setInstallPrompt(null)
    const onOnline = () => setIsOffline(false)
    const onOffline = () => setIsOffline(true)

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onAppInstalled)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onAppInstalled)
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  if (isOffline) {
    return (
      <aside className="pwa-badge pwa-badge--offline" role="status">
        <WifiOff size={16} />
        <span>Mode Offline Aktif — Data katalog tetap tersedia secara lokal.</span>
      </aside>
    )
  }

  if (installPrompt && !dismissed) {
    return (
      <aside className="pwa-badge">
        <div className="pwa-badge-content">
          <Download size={16} color="var(--accent)" />
          <span>Install <strong>GlowVault</strong> ke layar utama.</span>
        </div>
        <div className="pwa-badge-actions">
          <button type="button" className="btn btn--primary btn--sm" onClick={handleInstall}>
            Install
          </button>
          <button type="button" className="icon-btn" onClick={() => setDismissed(true)}>
            <X size={14} />
          </button>
        </div>
      </aside>
    )
  }

  return null
}