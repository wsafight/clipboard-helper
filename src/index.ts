import ClipboardJs from 'clipboard'
import { convertImageToBlob } from './utils'

const copyTextToClipboard = (textToCopy: string) => {
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
  if (!img || (img !== 'string' && !(img instanceof HTMLImageElement))) {
    return Promise.reject('image must be a string or HTMLImageElement')
  }

  if (img === 'string') {
    return fetch(img).then(data => {
      return data.blob()
    }).then(blob => {
      return navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
    })
  }

  const blobFromImg =  convertImageToBlob(img)

  return navigator.clipboard.write([
    new ClipboardItem({
      [blobFromImg.type]: blobFromImg
    })
  ])
}

export {
  copyTextToClipboard,
  copyImageToClipboard,
}