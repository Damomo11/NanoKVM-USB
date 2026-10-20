import { ReactElement, useEffect, useRef, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { TerminalIcon, XIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { IpcEvents } from '@common/ipc-events'
import { debugModeAtom, serialPortStateAtom } from '@renderer/jotai/device'

type Line = { text: string; cls?: string }

export const TestConsole = (): ReactElement | null => {
  const { t } = useTranslation()
  const [isDebug] = useAtom(debugModeAtom)
  const serialPortState = useAtomValue(serialPortStateAtom)

  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)

  const isEchoOn = serialPortState === 'connected'

  useEffect(() => {
    if (!isDebug) return

    const rm = window.electron.ipcRenderer.on(IpcEvents.TEST_MODE_ECHO, (_, text: string) => {
      setLines((prev) => [...prev.slice(-499), { text, cls: 'text-emerald-300' }])
    })
    return () => {
      rm()
    }
  }, [isDebug])

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [lines])

  if (!isDebug) return null

  const submit = (): void => {
    if (!input.trim()) return
    setLines((prev) => [
      ...prev.slice(-498),
      { text: `root@localhost:~# ${input}`, cls: 'text-emerald-400' },
      ...runFakeShell(input).map((text) => ({ text }))
    ])
    setInput('')
  }

  return (
    <div className="fixed bottom-4 left-4 z-[2000] flex h-[240px] w-[520px] flex-col overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900/95 shadow-2xl">
      <div className="flex items-center justify-between bg-neutral-800 px-3 py-1.5">
        <div className="flex items-center space-x-2 text-xs text-neutral-300">
          <TerminalIcon size={14} />
          <span className="font-mono">{t('debug.terminal')}</span>
          <span
            className={
              isEchoOn
                ? 'rounded bg-emerald-900 px-1.5 text-emerald-300'
                : 'rounded bg-yellow-900 px-1.5 text-yellow-300'
            }
          >
            {isEchoOn ? t('debug.echoOn') : t('debug.localInput')}
          </span>
        </div>
        <button
          className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded text-neutral-400 hover:bg-neutral-700 hover:text-white"
          title={t('debug.exit')}
          onClick={() => {
            window.electron.ipcRenderer.invoke(IpcEvents.SET_TEST_MODE, false)
            window.location.reload()
          }}
        >
          <XIcon size={14} />
        </button>
      </div>

      <div
        ref={bodyRef}
        className="flex-1 overflow-y-auto px-3 py-2 font-mono text-[12px] leading-[18px] text-neutral-200"
      >
        <div className="text-neutral-500">{t('debug.hint')}</div>
        {lines.map((l, i) => (
          <div key={i} className={l.cls ?? ''} style={l.cls ? undefined : { whiteSpace: 'pre-wrap' }}>
            {l.text}
          </div>
        ))}
        <div className="text-emerald-400">root@localhost:~#</div>
      </div>

      <div className="flex items-center gap-2 border-t border-neutral-700 bg-neutral-800 px-2 py-1.5">
        <span className="font-mono text-[12px] text-emerald-400">$</span>
        <input
          className="flex-1 bg-transparent font-mono text-[12px] text-neutral-100 outline-none"
          value={input}
          placeholder="type a command… (help)"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
        />
      </div>
    </div>
  )
}

function runFakeShell(cmd: string): string[] {
  const [name, ...args] = cmd.trim().split(/\s+/)
  switch (name) {
    case 'help':
      return ['Commands: help, ls, pwd, cat <file>, echo <text>, uname, whoami, uptime']
    case 'ls':
      return ['bin  dev  etc  home  lib  opt  root  sbin  tmp  usr  var']
    case 'pwd':
      return ['/root']
    case 'whoami':
      return ['root']
    case 'uname':
      return ['Linux localhost 5.15.0-generic x86_64 GNU/Linux']
    case 'uptime':
      return [` ${new Date().toLocaleTimeString()} up 42 days, load average: 0.05`]
    case 'echo':
      return [args.join(' ')]
    case 'cat':
      if (!args[0]) return ['cat: missing operand']
      return [`(mock) content of ${args[0]}: hello from test mode`]
    default:
      return [`${name}: command not found (try 'help')`]
  }
}
