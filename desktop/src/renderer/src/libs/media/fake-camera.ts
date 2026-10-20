/**
 * Test mode virtual camera: a canvas-drawn "target machine console"
 * stands in for the HDMI capture card, no hardware / camera permission needed.
 */

let stream: MediaStream | null = null
let timer: number | undefined

export function fakeCameraStream(): MediaStream {
  if (stream) return stream

  const canvas = document.createElement('canvas')
  canvas.width = 1280
  canvas.height = 720
  const ctx = canvas.getContext('2d')!

  const draw = (): void => {
    const t = new Date()
    ctx.fillStyle = '#101418'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#1f2937'
    ctx.fillRect(0, 0, canvas.width, 46)
    ctx.fillStyle = '#9ca3af'
    ctx.font = '22px monospace'
    ctx.fillText('NanoKVM-USB TEST MODE — virtual target machine', 24, 31)

    ctx.fillStyle = '#10b981'
    ctx.font = '30px monospace'
    const prompt = 'root@localhost:~#'
    ctx.fillText(prompt, 60, 150)

    ctx.fillStyle = '#e5e7eb'
    ctx.font = '26px monospace'
    const lines = [
      'This screen replaces the HDMI capture card.',
      '',
      'Your keyboard / mouse events are sent to the',
      'virtual serial port and echoed into the test',
      'console at the bottom-left of the window.',
      '',
      'Try the Paste dialog (with speed setting),',
      'virtual keyboard, mouse modes, shortcuts…',
      '',
      `uptime: ${t.toLocaleTimeString()}`
    ]
    lines.forEach((line, i) => ctx.fillText(line, 60, 220 + i * 40))

    if (t.getSeconds() % 2 === 0) {
      ctx.fillStyle = '#10b981'
      ctx.fillRect(60 + ctx.measureText(prompt).width + 14, 128, 18, 30)
    }
  }
  draw()
  timer = window.setInterval(draw, 500)

  stream = canvas.captureStream(10)
  return stream
}

export function stopFakeCamera(): void {
  if (timer) {
    window.clearInterval(timer)
    timer = undefined
  }
  stream?.getTracks().forEach((track) => track.stop())
  stream = null
}
