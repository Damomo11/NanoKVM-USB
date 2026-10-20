import { ReactElement, useState } from 'react'
import { ClipboardIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PasteDialog } from './paste-dialog'

export const Paste = (): ReactElement => {
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <div
        className="flex h-[30px] cursor-pointer items-center space-x-2 rounded px-3 text-neutral-300 hover:bg-neutral-700/50"
        onClick={() => setIsDialogOpen(true)}
      >
        <ClipboardIcon size={16} />
        <span>{t('keyboard.paste')}</span>
      </div>

      <PasteDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}
