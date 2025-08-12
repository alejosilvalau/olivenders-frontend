export function fallbackOnImgError(event: Event, fallbackSrc: string = '/default-wand.png'): void {
  const img = event.target as HTMLImageElement;
  if (img.src !== fallbackSrc) {
    img.src = fallbackSrc;
  }
}
