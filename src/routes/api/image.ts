import express from 'express';
import file from './../../files/file';

// query segments
interface ImgQuery {
  filename?: string;
  width?: string;
  height?: string;
}

const validate = async (query: ImgQuery): Promise<null | string> => {
  // Check if requested file is available
  if (!(await file.isImgAvailable(query.filename))) {
    const availableImgNames: string = (await file.getAvailableImgNames()).join(
      ', '
    );
    return `Please provide valid filename in the filename option, Available filenames are: ${availableImgNames}.`;
  }

  if (!query.width && !query.height) {
    return null; // No size values
  }

  // Check for valid width value
  const width: number = parseInt(query.width || '');
  if (Number.isNaN(width) || width < 1) {
    return 'write a valid width please';
  }

  // Check for valid height value
  const height: number = parseInt(query.height || '');
  if (Number.isNaN(height) || height < 1) {
    return 'write a valid height please';
  }

  return null;
};

const images: express.Router = express.Router();

images.get(
  '/',
  async (
    request: express.Request,
    response: express.Response
  ): Promise<void> => {
    const validationMessage: null | string = await validate(request.query);
    if (validationMessage) {
      response.send(validationMessage);
      return;
    }

    let error: null | string = '';

    if (!(await file.isThumbAvailable(request.query))) {
      error = await file.createThumb(request.query);
    }

    if (error) {
      response.send(error);
      return;
    }

    const path: null | string = await file.getImgPath(request.query);
    if (path) {
      response.sendFile(path);
    } else {
      response.send('error while displaying');
    }
  }
);

export default images;
