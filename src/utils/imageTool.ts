import { nTot } from './numbro';
/**
 * TODO:
 * 1. 壓縮比例應該調整成最高大小以及最少壓縮
 * 2. 浮水印改為整版面斜向
 *  -- 完成了基底還需要微調整。
 */

// === Blob || Canvas 轉 File ===
const bTof = async (from: HTMLCanvasElement | Blob, quality?: number): Promise<File> => {
  if (from instanceof Blob) {
    const file = new File([from], 'img.jpg', { type: 'image/jpeg' });
    return file;
  }
  const compressedBlob = await new Promise<Blob>((resolve) => {
    from.toBlob(
      (blob) => {
        if (blob) resolve(blob);
      },
      'image/jpeg',
      quality ?? 0.8,
    );
  });
  const file = new File([compressedBlob], 'img.jpg', { type: 'image/jpeg' });
  return file;
};

// === 產生畫布 ===
const createCx = async (file: File) => {
  const maxWidth = 800;
  const maxHeight = 800;
  const img = new Image();
  img.src = URL.createObjectURL(file);

  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve();
    };
    img.onerror = reject;
  });
  const { width, height } = img;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  if (canvas.width > maxWidth) {
    canvas.width = maxWidth;
    canvas.height = width ? (maxWidth * height) / width : maxHeight;
  }
  if (height > maxHeight) {
    canvas.height = maxHeight;
    canvas.width = height ? (maxHeight * width) / height : maxWidth;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return { ctx, canvas, width, height };
};

// === 浮水印 ===
type DrawRes =
  | {
      wImg: string;
      wFile: File;
    }
  | false;
const drawWaterMark = async (file: File, mark?: string): Promise<DrawRes> => {
  const { ctx, canvas } = (await createCx(file)) || {};
  if (!ctx || !canvas) return false;

  ctx.font = `${canvas.width / 20 < 20 ? 20 : canvas.width / 20}px Arial`;
  ctx.textBaseline = 'middle';
  const text = mark ?? 'APEC';
  ctx.rotate(-Math.PI / 2);
  let left = 20;
  let top = 20;
  const dx = canvas.width / 5;
  const dy = canvas.height / 5;
  while (top < canvas.height) {
    left = 20;
    while (left < canvas.width) {
      console.log('on draw', { left, top, width: canvas.width, height: canvas.height });
      ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
      ctx.fillRect(left, top, 100, 30);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillText(text, left, top, 80);
      left += dx;
    }
    top += dy;
  }
  ctx.font = '200px Arial';
  ctx.fillText('test', 50, 50);

  ctx.rotate(Math.PI / 2);
  const wImg = canvas.toDataURL('image/jpeg', 0.8);
  const wFile = await bTof(canvas);
  return { wImg, wFile };
};

// === 壓縮 ===
type CompressionOptions = {
  file: File | undefined | null;
  sizeLog?: boolean;
};

type CompressionRes = Promise<
  | false
  | {
      beanImg: string;
      beanFile: File;
    }
>;
const compression = async (props: CompressionOptions): CompressionRes => {
  const { file, sizeLog } = props;
  if (!file) return Promise.resolve(false);
  const { ctx, canvas } = (await createCx(file)) || {};

  // #: 壓縮
  if (!ctx || !canvas) return Promise.resolve(false);
  const beanImg = canvas.toDataURL('image/jpeg', 0.5);
  const beanFile = await bTof(canvas);

  // #: Size compare log
  if (import.meta.env.DEV && sizeLog) {
    console.info('Origin file size:', nTot({ value: file.size }));
    if (beanFile) console.info('Compressed file size:', nTot({ value: beanFile.size }));
  }
  return { beanImg, beanFile };
};

export { compression, drawWaterMark, createCx, bTof };
