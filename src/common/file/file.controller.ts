import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
  UsePipes,
  ValidationPipe,
  Get,
  Res,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { extname } from 'path';
import * as mimeTypes from 'mime-types';
import * as fs from 'fs';


@Controller('/api/v1/image')
export class FileController {

  @Get('/get-image/:filename')
  async getImage(@Res() res: Response, @Param('filename') filename: string) {
    try {
      const imagePath = path.join(process.cwd(), 'uploads', filename);

      // Check if the image file exists
      if (!fs.existsSync(imagePath)) {
        throw new NotFoundException('Image not found');
      }

      // Send the image file as the response
      (res as any).sendFile(imagePath);
    } catch (error) {
      // Handle other errors
      throw new NotFoundException('Image not found');
    }
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: FileController.getFileDestination,
        filename: FileController.getFileName,
      }),
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    }),
  )


  async uploadFile(@UploadedFile() file, @Query('previousFilename') previousFilename) {
    try {
      const uploadsPath = path.join(process.cwd(), 'uploads');

      // Check if the "uploads" directory exists, create it if not
      try {
        await fsPromises.access(uploadsPath);
      } catch (error) {
        await fsPromises.mkdir(uploadsPath, { recursive: true });
      }

      // Validate file type
      const mimeType = mimeTypes.lookup(file.originalname);
      if (!mimeType || !['image/jpeg', 'image/png'].includes(mimeType)) {
        throw new BadRequestException('Invalid file type. Only JPEG and PNG are allowed.');
      }

      // The file is now available on the local server, and you can save its information to the database or perform other actions.

      // Delete the previous file if a previous filename is provided
      if (previousFilename && previousFilename !== '') {
        const previousFilePath = path.join(process.cwd(), 'uploads', previousFilename);
        await fsPromises.unlink(previousFilePath);
      }

      return { filename: file.filename };
    } catch (error) {
      // Log the error
      console.error('Error uploading file:', error.message);
      throw error;
    }
  }

  private static async getFileDestination(req, file, callback) {
    const destination = path.join(process.cwd(), 'uploads');
    console.log('Destination:', destination);
    callback(null, destination);
  }

  private static async getFileName(req, file, callback) {
    // Use the previous filename if available in the query parameters, otherwise generate a new one
    const previousFilename = req.query.previousFilename as string || '';
    console.log('previousFilename', previousFilename);
    const timestamp = new Date().getTime();
    const uniqueFileName = `${file.originalname}-${timestamp}${extname(file.originalname)}`;

    // Delete the previous file if a previous filename is provided
    if (previousFilename && previousFilename !== '') {
      const previousFilePath = path.join(process.cwd(), 'uploads', previousFilename);
      await fsPromises.unlink(previousFilePath).catch((unlinkError) => {
        if (unlinkError) {
          console.error('Error deleting previous file:', unlinkError);
        }
      });
    }

    callback(null, uniqueFileName);
  }
}
