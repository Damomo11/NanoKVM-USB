import { ReactElement } from 'react'
import { FlaskConicalIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { IpcEvents } from '@common/ipc-events'
import * as storage from '@renderer/libs/storage'

/**
 * Entry shown in the Connect modal:
 * one click to relaunch into hardware-free test mode.
 */
export const TestModeEntry = (): ReactElement => {
  const { t } = useTranslation()

  function enterTestMode(): void {
    storage.setDebugMode(true)
    window.electron.ipcRenderer.invoke(IpcEvents.SET_TEST_MODE, true)
    window.location.reload()
  }

  return (
    <div
      className="flex h-[28px] w-[280px] cursor-pointer items-center justify-center gap-2 rounded border border-neutral-700 text-xs text-neutral-400 hover:border-emerald-600 hover:text-emerald-400"
      onClick={enterTestMode}
      title={t('debug.hint')}
    >
      <FlaskConicalIcon size={14} />
      <span>{t('debug.title')}</span>
      <span className="text-neutral-600">·</span>
      <span>{t('debug.noHardware')}</span>
    </div>
  )
}
