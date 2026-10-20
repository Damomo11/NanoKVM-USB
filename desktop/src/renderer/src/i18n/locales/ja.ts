const ja = {
  translation: {
    camera: {
      tip: '認証を待っています...',
      denied: '認証に失敗しました',
      authorize:
        'リモートデスクトップにはカメラの許可が必要です。設定でカメラの許可を与えてください。',
      failed: 'カメラへの接続に失敗しました。もう一度お試しください。'
    },
    modal: {
      title: 'USBデバイスを選択',
      selectVideo: 'ビデオ入力デバイスを選択してください',
      selectSerial: 'シリアルデバイスを選択してください',
      selectBaudRate: 'ボーレートを選択してください'
    },
    menu: {
      serial: 'シリアル',
      keyboard: 'キーボード',
      mouse: 'マウス',
      serialPort: {
        device: 'シリアルデバイス',
        baudRate: 'ボーレート',
        noDeviceFound: 'シリアルデバイスが見つかりません',
        clickToSelect: 'クリックしてシリアルポートを選択'
      }
    },
    video: {
      resolution: '解像度',
      scale: '拡大縮小',
      customResolution: 'カスタム',
      device: 'デバイス',
      custom: {
        title: 'カスタム解像度',
        width: '幅',
        height: '高さ',
        confirm: 'OK',
        cancel: 'キャンセル'
      }
    },
    debug: {
          title: 'Test mode',
          titleOff: 'Test mode',
          terminal: 'Test console (no hardware)',
          hint: 'Keyboard output is echoed to this console instead of real hardware.',
          localInput: 'local input',
          echoOn: 'echo ON',
          exit: 'Exit test mode'
        },
    keyboard: {
      paste: '貼り付け',
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
      virtualKeyboard: 'キーボード',
      shortcut: {
        title: 'ショートカット',
        custom: 'カスタム',
        capture: 'ここをクリックしてショートカットをキャプチャ',
        clear: 'クリア',
        save: '保存'
      }
    },
    mouse: {
      cursor: {
        title: 'カーソル',
        pointer: 'ポインター',
        grab: 'グラブ',
        cell: 'セル',
        hide: '非表示'
      },
      mode: 'マウスモード',
      absolute: '絶対モード',
      relative: '相対モード',
      direction: 'ホイール方向',
      scrollUp: '上にスクロール',
      scrollDown: '下にスクロール',
      speed: 'ホイール速度',
      fast: '速い',
      slow: '遅い',
      requestPointer:
        '相対モードを使用中です。マウスポインターを取得するにはデスクトップをクリックしてください。',
      jiggler: {
        title: 'マウスジグラー',
        enable: '有効',
        disable: '無効'
      }
    },
    settings: {
      title: '設定',
        testmode: {
          title: 'Test mode'
        },
      appearance: {
        title: '外観',
        language: '言語',
        menu: 'メニューバー',
        menuTips: '起動時にメニューバーを開く'
      },
      update: {
        title: '更新を確認',
        latest: '最新バージョンを使用しています。',
        outdated: '更新が利用可能です。今すぐ更新しますか？',
        downloading: 'ダウンロード中...',
        installing: 'インストール中...',
        failed: '更新に失敗しました。もう一度お試しください。',
        confirm: '確認',
        cancel: 'キャンセル'
      },
      about: {
        title: 'バージョン情報',
        version: 'バージョン',
        community: 'コミュニティ'
      },
      reset: {
        title: '設定をリセット',
        description: 'すべてのアプリケーション設定をデフォルト値にリセットします',
        warning: '警告',
        warningDescription: 'この操作は元に戻せません。すべてのカスタム設定が失われます。',
        button: 'すべての設定をリセット',
        confirmTitle: 'リセットの確認',
        confirmMessage: 'すべての設定をリセットしてもよろしいですか？この操作は元に戻せません。',
        confirm: 'リセット',
        cancel: 'キャンセル'
      }
    }
  }
}

export default ja
