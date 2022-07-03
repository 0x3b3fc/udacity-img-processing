import { promises as fs } from 'fs';
import path from 'path';
import file from './../files/file';

describe('Test image processing using sharp', (): void => {
  it('raises an error (invalid width value)', async (): Promise<void> => {
    const error: null | string = await file.createThumb({
      filename: 'foo',
      width: '-100',
      height: '500'
    });
    expect(error).not.toBeNull();
  });

  it('raises an error (filename does not exist)', async (): Promise<void> => {
    const error: null | string = await file.createThumb({
      filename: 'foo',
      width: '100',
      height: '500'
    });
    expect(error).not.toBeNull();
  });

  it('succeeds to write resized thumb file (existing file, valid size values)', async (): Promise<void> => {
    await file.createThumb({ filename: 'fjord', width: '99', height: '99' });

    const resized_img_path: string = path.resolve(
      file.imgThumbPath,
      `fjord-99x99.jpg`
    );
    let errorFile: null | string = '';

    try {
      await fs.access(resized_img_path);
      errorFile = null;
    } catch {
      errorFile = 'File was not created';
    }

    expect(errorFile).toBeNull();
  });
});
afterAll(async (): Promise<void> => {
  const resized_img_path: string = path.resolve(
    file.imgThumbPath,
    'fjord-99x99.jpg'
  );

  try {
    await fs.access(resized_img_path);
    fs.unlink(resized_img_path);
  } catch (err) {
    console.log(err);
  }
});
