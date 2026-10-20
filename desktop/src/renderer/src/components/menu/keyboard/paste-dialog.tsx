import { ReactElement, useEffect, useState } from 'react'
import { Input, Modal, Slider, Spin } from 'antd'
import { useTranslation } from 'react-i18next'

import { IpcEvents } from '@common/ipc-events'
import { CharCodes, ShiftChars } from '@renderer/libs/keyboard/charCodes'
import { getModifierBit } from '@renderer/libs/keyboard/keymap'
import * as storage from '@renderer/libs/storage'

type PasteDialogProps = {
  open: boolean
  onClose: () => void
}

export const PasteDialog = ({ open, onClose }: PasteDialogProps): ReactElement => {
  const { t } = useTranslation()

  const [text, setText] = useState('')
  const [speed, setSpeed] = useState(20)
  const [isSending, setIsSending] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!open) {
      setProgress(0)
      setIsSending(false)
      return
    }

    setSpeed(storage.getPasteSpeed())
    navigator.clipboard.readText().then(setText).catch(() => setText(''))
  }, [open])

  async function send(): Promise<void> {
    if (isSending || !text) return
    setIsSending(true)
    setProgress(0)

    // release all keys for a clean state (same as hardware behaviour)
    await doSend([0, 0, 0, 0, 0, 0, 0, 0])

    let sent = 0
    for (const char of text) {
      const ascii = char.charCodeAt(0)
      const code = CharCodes[ascii]
      if (!code) continue

      let modifier = 0
      if ((ascii >= 65 && ascii <= 90) || ShiftChars[ascii]) {
        modifier |= getModifierBit('ShiftLeft')
      }

      await doSend([modifier, 0, code, 0, 0, 0, 0, 0])
      await sleep(speed)
      await doSend([modifier, 0, 0, 0, 0, 0, 0, 0])
      await sleep(Math.max(10, speed / 2))
      await doSend([0, 0, 0, 0, 0, 0, 0, 0])

      sent += 1
      setProgress(Math.round((sent / text.length) * 100))
    }

    setIsSending(false)
  }

  async function doSend(keys: number[]): Promise<void> {
    await window.electron.ipcRenderer.invoke(IpcEvents.SEND_KEYBOARD, keys)
  }

  function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms))
  }

  function onSpeedChange(value: number): void {
    setSpeed(value)
    storage.setPasteSpeed(value)
  }

  return (
    <Modal
      open={open}
      title={t('keyboard.pasteDialog.title')}
      footer={null}
      onCancel={() => {
        if (!isSending) onClose()
      }}
      destroyOnHidden
    >
      <div className="flex flex-col space-y-4 pt-2">
        <div>
          <div className="mb-1 text-sm text-neutral-400">{t('keyboard.pasteDialog.preview')}</div>
          <Input.TextArea
            value={text}
            rows={7}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('keyboard.pasteDialog.empty')}
            disabled={isSending}
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-sm text-neutral-400">
            <span>{t('keyboard.pasteDialog.speed')}</span>
            <span>
              {speed} ms {t('keyboard.pasteDialog.perKey')}
            </span>
          </div>
          <Slider
            min={1}
            max={200}
            step={1}
            value={speed}
            onChange={onSpeedChange}
            disabled={isSending}
          />
          <div className="flex justify-between text-xs text-neutral-500">
            <span>{t('keyboard.pasteDialog.fast')}</span>
            <span>{t('keyboard.pasteDialog.slow')}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {isSending ? (
            <div className="flex items-center gap-2">
              <Spin size="small" />
              <span className="text-sm text-neutral-400">
                {t('keyboard.pasteDialog.sending')} {progress}%
              </span>
            </div>
          ) : (
            <>
              <button
                className="h-[32px] w-[84px] cursor-pointer rounded border border-neutral-600 text-neutral-300 hover:bg-neutral-700/50"
                onClick={onClose}
              >
                {t('keyboard.pasteDialog.cancel')}
              </button>
              <button
                className="h-[32px] w-[84px] cursor-pointer rounded bg-blue-600 text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!text}
                onClick={send}
              >
                {t('keyboard.pasteDialog.send')}
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}
