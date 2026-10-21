import { CmdEvent } from '../device/proto'

/**
 * Test mode fake serial port (main process):
 * accepts the same write() calls as the real serialport,
 * answers GET_INFO so the UI thinks a device is attached,
 * and decodes keyboard HID reports into text for the test console.
 */

// HID keycode -> US-layout unshifted / shifted characters
const UNSHIFTED: Record<number, string> = {}
const SHIFTED: Record<number, string> = {}

function initLayout(): void {
  const add = (code: number, un: string, sh: string): void => {
    UNSHIFTED[code] = un
    SHIFTED[code] = sh
  }

  for (let i = 0; i < 26; i++) {
    add(0x04 + i, String.fromCharCode(97 + i), String.fromCharCode(65 + i)) // a-z / A-Z
  }

  add(0x1e, '1', '!')
  add(0x1f, '2', '@')
  add(0x20, '3', '#')
  add(0x21, '4', '$')
  add(0x22, '5', '%')
  add(0x23, '6', '^')
  add(0x24, '7', '&')
  add(0x25, '8', '*')
  add(0x26, '9', '(')
  add(0x27, '0', ')')
  add(0x28, '\n', '\n') // Enter
  add(0x29, '\x1b', '\x1b') // Escape
  add(0x2a, '\b', '\b') // Backspace
  add(0x2b, '\t', '\t') // Tab
  add(0x2c, ' ', ' ')
  add(0x2d, '-', '_')
  add(0x2e, '=', '+')
  add(0x2f, '[', '{')
  add(0x30, ']', '}')
  add(0x31, '\\', '|')
  add(0x33, ';', ':')
  add(0x34, "'", '"')
  add(0x36, ',', '<')
  add(0x37, '.', '>')
  add(0x38, '/', '?')
  add(0x39, '`', '~')
}

initLayout()

export type TestEchoListener = (text: string) => void

class FakeSerialPort {
  isOpen = true
  private pending: number[] = []
  private echoListener: TestEchoListener | null = null

  setEchoListener(listener: TestEchoListener): void {
    this.echoListener = listener
  }

  on(_event: string, _cb: (...args: unknown[]) => void): void {
    // pretend subscribe; 'close'/'error' never fire in test mode
  }

  removeAllListeners(): void {}

  write(data: Uint8Array): void {
    const bytes = Array.from(data)

    // wire format: 0x57 0xab ADDR CMD LEN DATA... SUM
    if (bytes[0] !== 0x57 || bytes[1] !== 0xab) return
    const cmd = bytes[3]
    const payload = bytes.slice(5, 5 + bytes[4])

    if (cmd === CmdEvent.GET_INFO) {
      const rsp = new Uint8Array(14)
      rsp[0] = 0x31 // version 1.0
      rsp[1] = 0x01 // connected
      rsp[2] = 0x01 // num lock
      this.pending.push(...Array.from(rsp))
      return
    }

    if (cmd === CmdEvent.SEND_KB_GENERAL_DATA && payload.length >= 3) {
      const modifier = payload[0]
      const shift = (modifier & ((1 << 1) | (1 << 5))) !== 0
      let out = ''
      for (let i = 2; i < payload.length && i < 8; i++) {
        const kc = payload[i]
        if (kc === 0) continue
        if (kc === 0x28) {
          out += '\n'
          continue
        }
        if (kc === 0x2a) {
          out += '\b'
          continue
        }
        out += shift ? SHIFTED[kc] ?? '' : UNSHIFTED[kc] ?? ''
      }
      if (out && this.echoListener) {
        this.echoListener(out)
      }
    }

    // mouse packets are high-frequency (every mousemove); echoing each one floods
    // the test console. Silently accept them - the virtual target cursor moves on its own.
  }

  async read(): Promise<{ value: Uint8Array; done: boolean }> {
    if (this.pending.length > 0) {
      const chunk = new Uint8Array(this.pending)
      this.pending = []
      return { value: chunk, done: false }
    }
    // nothing to read: short yield so the read loop keeps polling
    await new Promise((r) => setTimeout(r, 20))
    return { value: new Uint8Array(0), done: false }
  }

  close(_callback: (err: Error | null) => void): void {
    this.isOpen = false
    _callback(null)
  }
}

export const fakeSerialPort = new FakeSerialPort()
