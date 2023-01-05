import ClipboardJs from 'clipboard'
import { convertImageToBlob } from './utils'

const copyTextToClipboard = (textToCopy: string) => {

  if (!ClipboardJs.isSupported()) {
    return Promise.reject('The current browser does not support this feature')
  }

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

const copyImageToClipboard = async (img: string | HTMLImageElement) => {
  const clipboard = navigator.clipboard

  if (!clipboard) {
    return Promise.reject('The current browser does not support this feature')
  }

  if (!img || (img !== 'string' && !(img instanceof HTMLImageElement))) {
    return Promise.reject('image must be a string or HTMLImageElement')
  }

  if (img === 'string') {
    return fetch(img).then(data => {
      return data.blob()
    }).then(blob => {
      return clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
    })
  }

  const blobFromImg =  convertImageToBlob(img)

  return clipboard.write([
    new ClipboardItem({
      [blobFromImg.type]: blobFromImg
    })
  ])
}

export {
  copyTextToClipboard,
  copyImageToClipboard,
}