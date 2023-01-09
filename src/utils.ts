const convertImageToCanvas = (image: HTMLImageElement, width: number, height: number): HTMLCanvasElement => {
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  var ctx = canvas.getContext('2d')!
  ctx.drawImage(image, 0, 0);
  return canvas
}


const base64ToBlob = (urlData: string, type: string): Blob => {
  const [mimeInfo, content] = urlData.split(',')
  let mime = type
  if (mimeInfo) {
    mime = mimeInfo.match(/:(.*?);/)?.[1] || type;
  }
  const bytes = window.atob(content)
  const ab = new ArrayBuffer(bytes.length)
  const ia = new Uint8Array(ab)
  for (let index = 0; index < bytes.length; index++) {
    ia[index] = bytes.charCodeAt(index)
  }
  return new Blob([ab], { type: mime })
};


/**
 * 此函数用来处理图片格式的转化
 * @param img <img src="">用来转化的原图片
 * @param type 转化的格式类型
 * @return blob
 */
export const convertImageToBlob = (
  img: HTMLImageElement,
  type: string = 'png'
): Blob => {
  img.setAttribute('crossOrigin', 'anonymous');
  const { naturalHeight: height, naturalWidth: width } = img
  const canvas = convertImageToCanvas(img, width, height)
  return base64ToBlob(canvas.toDataURL(`image/${type}`), type)
}
