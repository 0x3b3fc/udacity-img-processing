import { promises as fs } from 'fs';
import path from 'path';
import processImage from './../img_process';

interface ImgQuery {
  filename?: string;
  width?: string;
  height?: string;
}

export default class file {
  // Default paths
  static imgFullPath = path.resolve(__dirname, './../../images');
  static imgThumbPath = path.resolve(__dirname, './../../images/thumb');

  static async getImgPath(params: ImgQuery): Promise<null | string> {
    if (!params.filename) {
      return null;
    }

    const file_path: string =
      params.width && params.height
        ? path.resolve(
            file.imgThumbPath,
            `${params.filename}-${params.width}x${params.height}.jpg`
          )
        : path.resolve(file.imgFullPath, `${params.filename}.jpg`);

    try {
      await fs.access(file_path);
      return file_path;
    } catch {
      return null;
    }
  }

  static async isImgAvailable(filename: string = ''): Promise<boolean> {
    if (!filename) {
      return false;
    }

    return (await file.getAvailableImgNames()).includes(filename);
  }

  static async getAvailableImgNames(): Promise<string[]> {
    try {
      return (await fs.readdir(file.imgFullPath)).map(
        (filename: string): string => filename.split('.')[0]
      );
    } catch {
      return [];
    }
  }
  static async isThumbAvailable(params: ImgQuery): Promise<boolean> {
    if (!params.filename || !params.width || !params.height) {
      return false;
    }
    const file_path: string = path.resolve(
      file.imgThumbPath,
      `${params.filename}-${params.width}x${params.height}.jpg`
    );

    try {
      await fs.access(file_path);
      return true;
    } catch {
      return false;
    }
  }

  static async create_thumb_path(): Promise<void> {
    try {
      await fs.access(file.imgThumbPath);
    } catch {
      fs.mkdir(file.imgThumbPath);
    }
  }

  static async createThumb(params: ImgQuery): Promise<null | string> {
    if (!params.filename || !params.width || !params.height) {
      return null;
    }

    const file_full_path: string = path.resolve(
      file.imgFullPath,
      `${params.filename}.jpg`
    );
    const file_thumb_path: string = path.resolve(
      file.imgThumbPath,
      `${params.filename}-${params.width}x${params.height}.jpg`
    );

    console.log(`Creating thumb ${file_thumb_path}`);

    return await processImage({
      source: file_full_path,
      target: file_thumb_path,
      width: parseInt(params.width),
      height: parseInt(params.height)
    });
  }
}
