const de = {
  translation: {
    camera: {
      tip: 'Warten auf Berechtigung...',
      denied: 'Berechtigung verweigert',
      authorize:
        'Der Remote-Desktop erfordert eine Kamerazulassung. Bitte autorisieren Sie die Kamera in den Browsereinstellungen.',
      failed: 'Kamera konnte nicht verbunden werden. Bitte versuche es erneut.'
    },
    modal: {
      title: 'USB-Gerät auswählen',
      selectVideo: 'Bitte wählen Sie ein Video-Eingabegerät',
      selectSerial: 'Serielles Gerät auswählen',
      selectBaudRate: 'Bitte wählen Sie die Baudrate'
    },
    menu: {
      serial: 'Seriell',
      keyboard: 'Tastatur',
      mouse: 'Maus',
      serialPort: {
        device: 'Serielles Gerät',
        baudRate: 'Baudrate',
        noDeviceFound: 'Keine seriellen Geräte gefunden',
        clickToSelect: 'Klicken Sie, um seriellen Port auszuwählen'
      }
    },
    video: {
      resolution: 'Auflösung',
      scale: 'Skalierung',
      customResolution: 'Benutzerdefiniert',
      device: 'Gerät',
      custom: {
        title: 'Benutzerdefinierte Aufösung',
        width: 'Breite',
        height: 'Höhe',
        confirm: 'Ok',
        cancel: 'Abbrechen'
      }
    },
    debug: {
          title: 'Test mode',
          titleOff: 'Test mode',
          terminal: 'Test console (no hardware)',
          hint: 'Keyboard output is echoed to this console instead of real hardware.',
          localInput: 'local input',
          echoOn: 'echo ON',
          exit: 'Exit test mode',
          noHardware: 'Try all features without hardware'
        },
    keyboard: {
      paste: 'Einfügen',
      pasteDialog: {
              title: 'Paste to target machine',
              preview: 'Text preview (editable)',
              empty: 'Clipboard is empty. Type or paste text here.',
              speed: 'Typing speed',
              perKey: 'per key',
              fast: 'Fast',
              slow: 'Slow (for BIOS / login screens)',
              send: 'Send',
              cancel: 'Cancel',
              sending: 'Sending…'
            },
      virtualKeyboard: 'Virtuelle Tastatur',
      shortcut: {
        title: 'Tastenkürzel',
        ctrlAltDel: 'Strg + Alt + Entfernen',
        ctrlD: 'Strg + D',
        winTab: 'Win + Tab'
      }
    },
    mouse: {
      cursor: {
        title: 'Mauszeiger',
        pointer: 'Zeiger',
        grab: 'Hand',
        cell: 'Kreuz',
        hide: 'Versteckt'
      },
      mode: 'Mausmodus',
      absolute: 'Absoluter Modus',
      relative: 'Relativer Mode',
      direction: 'Scrollrichtung',
      scrollUp: 'Hochscrollen',
      scrollDown: 'Runterscrollen',
      speed: 'Scrollgeschwindigkeit',
      fast: 'Schnell',
      slow: 'Langsam',
      requestPointer:
        'Benutze relativen Modus. Bitte auf den Desktop klicken, um den Mauszeiger anzuzeigen.'
    },
    settings: {
      title: 'Einstellungen',
        testmode: {
          title: 'Test mode'
        },
      appearance: {
        title: 'Aussehen',
        language: 'Sprache',
        menu: 'Menüleiste',
        menuTips: 'Menüleiste beim Start öffnen'
      },
      update: {
        title: 'Überprüfe auf Updates',
        latest: 'Du hast bereits die neuste Version.',
        outdated: 'Ein Update ist verfügbar. Möchtest du jetzt updaten?',
        downloading: 'Wird heruntergeladen...',
        installing: 'Wird installiert...',
        failed: 'Update fehlgeschlagen. Bitte erneut versuchen.',
        confirm: 'Bestätigen',
        cancel: 'Abbrechen'
      },
      about: {
        title: 'Über',
        version: 'Version',
        community: 'Community'
      },
      reset: {
        title: 'Einstellungen zurücksetzen',
        description: 'Alle Anwendungseinstellungen auf Standardwerte zurücksetzen',
        warning: 'Warnung',
        warningDescription:
          'Diese Aktion kann nicht rückgängig gemacht werden. Alle benutzerdefinierten Einstellungen gehen verloren.',
        button: 'Alle Einstellungen zurücksetzen',
        confirmTitle: 'Zurücksetzen bestätigen',
        confirmMessage:
          'Sind Sie sicher, dass Sie alle Einstellungen zurücksetzen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
        confirm: 'Zurücksetzen',
        cancel: 'Abbrechen'
      }
    }
  }
}

export default de
