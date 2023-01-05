import ClipboardJs from 'clipboard'

const copyToClipboard = (textToCopy: string) => {
  return new Promise(function (resolve, reject) {
    const fakeBtn = document.createElement('button')

    const clipboard = new ClipboardJs(fakeBtn, {
      text: () => textToCopy,
      action: () => 'copy',
      container: document.body,
    })

    clipboard.on('success', function (e) {
      clipboard.destroy()
      resolve(e)
    })

    clipboard.on('error', function (e) {
      clipboard.destroy()
      reject(e)
    })
    
    fakeBtn.click()
  })
}

export {
  copyToClipboard
}