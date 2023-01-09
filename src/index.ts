import ClipboardJs, { isSupported } from 'clipboard'
import { convertImageToBlob } from './utils'

const isSupportTextToClipboard = isSupported

const copyTextToClipboard = (text: string) => {

  if (!isSupported()) {
    return Promise.reject('The current browser does not support this feature')
  }

  if (!text || typeof text !== 'string') {
    return Promise.reject('text must be a string')
  }

  return new Promise(function (resolve, reject) {
    const fakeBtn = document.createElement('button')

    const clipboard = new ClipboardJs(fakeBtn, {
      text: () => text,
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


const isSupportFileToClipboard = () => !!navigator?.clipboard?.write

const copyFileToClipboard = async (urlOrImg: string | HTMLImageElement) => {
  const clipboard = navigator.clipboard

  if (!clipboard || !clipboard.write) {
    return Promise.reject('The current browser does not support this feature')
  }

  if (!urlOrImg || (typeof urlOrImg !== 'string' && !(urlOrImg instanceof HTMLImageElement))) {
    return Promise.reject('image must be a string or HTMLImageElement')
  }

  if (typeof urlOrImg === 'string') {
    return fetch(urlOrImg).then(data => {
      return data.blob()
    }).then(blob => {
      return clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
    })
  }

  const blobFromImg =  convertImageToBlob(urlOrImg)

  return clipboard.write([
    new ClipboardItem({
      [blobFromImg.type]: blobFromImg
    })
  ])
}

const readTextFromClipboard = (): Promise<string> => {
  const clipboard = navigator.clipboard

  if (!clipboard || !clipboard.readText) {
    return Promise.reject('The current browser does not support this feature')
  }

  return clipboard.readText()
}

export {
  isSupportTextToClipboard,
  isSupportFileToClipboard,
  copyTextToClipboard,
  copyFileToClipboard,
  readTextFromClipboard,
}