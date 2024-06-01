export function getPreview(f: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        res(event.target.result as string);
      }
    };
    reader.onerror = (err) => {
      rej(err);
    };
    reader.readAsDataURL(f);
  });
}
