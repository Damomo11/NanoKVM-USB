import { ReactElement, useEffect, useState } from 'react'
import { Divider, Switch } from 'antd'
import { FlaskConicalIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { IpcEvents } from '@common/ipc-events'
import * as storage from '@renderer/libs/storage'

export const TestMode = (): ReactElement => {
  const { t } = useTranslation()

  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    setIsEnabled(storage.getDebugMode())
  }, [])

  function toggle(value: boolean): void {
    storage.setDebugMode(value)
    window.electron.ipcRenderer.invoke(IpcEvents.SET_TEST_MODE, value)
    window.location.reload()
  }

  return (
    <>
      <div className="text-base font-bold">{t('debug.title')}</div>
      <Divider />

      <div className="flex items-center justify-between pt-3">
        <div className="flex items-center space-x-1">
          <FlaskConicalIcon size={16} />
          <span>{t('debug.title')}</span>
        </div>
        <Switch checked={isEnabled} onChange={toggle} />
      </div>

      <div className="pt-3 text-xs leading-5 text-neutral-400">{t('debug.hint')}</div>
    </>
  )
}
