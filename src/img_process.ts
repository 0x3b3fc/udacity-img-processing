import sharp from 'sharp';

interface sharp_params {
  source: string;
  target: string;
  width: number;
  height: number;
}

const process_img = async (params: sharp_params): Promise<null | string> => {
  try {
    await sharp(params.source)
      .resize(params.width, params.height)
      .toFormat('jpeg')
      .toFile(params.target);
    return null;
  } catch {
    return 'i can not process this image';
  }
};

export default process_img;
