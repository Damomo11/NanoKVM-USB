import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { SerialPort } from 'serialport'

import log from 'electron-log/main'

import { IpcEvents } from '../../common/ipc-events'
import { device } from '../device'
import { fakeSerialPort } from '../device/fake-serial-port'

let isTestMode = false
let echoTarget: Electron.WebContents | null = null

fakeSerialPort.setEchoListener((text) => {
  log.info('[test-mode] echo:', JSON.stringify(text).slice(0, 120))
  if (isTestMode && echoTarget && !echoTarget.isDestroyed()) {
    echoTarget.send(IpcEvents.TEST_MODE_ECHO, text)
  }
})

export function registerSerialPort(): void {
  ipcMain.handle(IpcEvents.GET_SERIAL_PORTS, getSerialPorts)
  ipcMain.handle(IpcEvents.OPEN_SERIAL_PORT, openSerialPort)
  ipcMain.handle(IpcEvents.CLOSE_SERIAL_PORT, closeSerialPort)
  ipcMain.handle(IpcEvents.SEND_KEYBOARD, sendKeyboard)
  ipcMain.handle(IpcEvents.SEND_MOUSE, sendMouse)
  ipcMain.handle(IpcEvents.SET_TEST_MODE, (_e, enabled: boolean) => {
    log.info('[test-mode] SET_TEST_MODE ->', enabled)
    isTestMode = enabled
    if (enabled) {
      echoTarget = _e.sender
    }
    return true
  })
}

async function getSerialPorts(): Promise<string[]> {
  if (isTestMode) {
    return ['TEST-MODE (virtual)']
  }
  try {
    const ports = await SerialPort.list()
    const paths = ports.map((port) => port.path)

    return paths.sort((a, b) => {
      const aHasUSB = a.toLowerCase().includes('usb')
      const bHasUSB = b.toLowerCase().includes('usb')

      if (aHasUSB && !bHasUSB) return -1
      if (!aHasUSB && bHasUSB) return 1
      return a.localeCompare(b)
    })
  } catch (error) {
    console.error('Error listing serial ports:', error)
    return []
  }
}

async function openSerialPort(
  e: IpcMainInvokeEvent,
  path: string,
  baudRate: number = 57600
): Promise<boolean> {
  if (isTestMode) {
    log.info('[test-mode] openSerialPort (fake)')
    echoTarget = e.sender
    await device.serialPort.init({ path, baudRate, onDisconnect: () => {} }, fakeSerialPort)
    e.sender.send(IpcEvents.OPEN_SERIAL_PORT_RSP, '')
    return true
  }

  try {
    const onDisconnect = () => {
      e.sender.send(IpcEvents.SERIAL_PORT_DISCONNECTED)
    }

    await device.serialPort.init({ path, baudRate, onDisconnect })

    e.sender.send(IpcEvents.OPEN_SERIAL_PORT_RSP, '')
    return true
  } catch (error) {
    console.error('Error opening serial port:', error)
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    e.sender.send(IpcEvents.OPEN_SERIAL_PORT_RSP, errorMsg)
    return false
  }
}

async function closeSerialPort(): Promise<boolean> {
  try {
    await device.serialPort.close()
    return true
  } catch (error) {
    console.error('Error closing serial port:', error)
    return false
  }
}

async function sendKeyboard(_: IpcMainInvokeEvent, report: number[]): Promise<void> {
  try {
    await device.sendKeyboardData(report)
  } catch (error) {
    console.error('Error sending keyboard data:', error)
  }
}

async function sendMouse(_: IpcMainInvokeEvent, report: number[]): Promise<void> {
  try {
    await device.sendMouseData(report)
  } catch (error) {
    console.error('Error sending mouse data:', error)
  }
}
