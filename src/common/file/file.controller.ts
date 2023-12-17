import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Res, Param, NotFoundException, Logger, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { extname } from 'path';
import * as mimeTypes from 'mime-types';

@Controller('/api/v1/image')
export class FileController {
  private static readonly UPLOADS_PATH = path.join(process.cwd(), 'uploads');
  private static logger = new Logger(FileController.name);

  @Get('/get-image/:filename')
  async getImage(@Res() res: Response, @Param('filename') filename: string) {
    try {
      const imagePath = path.join(FileController.UPLOADS_PATH, filename);

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
      // Check if the "uploads" directory exists, create it if not
      if (!fs.existsSync(FileController.UPLOADS_PATH)) {
        fs.mkdirSync(FileController.UPLOADS_PATH, { recursive: true });
      }

      // Validate file type
      const mimeType = mimeTypes.lookup(file.originalname);
      if (!mimeType || !mimeType.startsWith('image/')) {
        throw new BadRequestException('Invalid file type. Only images are allowed.');
      }

      // The file is now available on the local server, and you can save its information to the database or perform other actions.

      // Delete the previous file if a previous filename is provided
      if (previousFilename && previousFilename !== '') {
        const previousFilePath = path.join(FileController.UPLOADS_PATH, previousFilename);
        await fsPromises.unlink(previousFilePath).catch((unlinkError) => {
          if (unlinkError) {
            FileController.logger.error(`Error deleting previous file '${previousFilePath}':`, unlinkError);
          }
        });
      }

      return { filename: file.filename };
    } catch (error) {
      // Log the error
      FileController.logger.error('Error uploading file:', error.message);
      throw error;
    }
  }

  private static getFileDestination(req, file, callback) {
    const destination = FileController.UPLOADS_PATH;
    callback(null, destination);
  }

  private static async getFileName(req, file, callback) {
    // Use the previous filename if available in the query parameters, otherwise generate a new one
    const previousFilename = req.query.previousFilename as string || '';
    const timestamp = new Date().getTime();
    const uniqueFileName = `${file.originalname}-${timestamp}${extname(file.originalname)}`;
  
    // Delete the previous file if a previous filename is provided
    if (previousFilename && previousFilename !== '') {
      const previousFilePath = path.join(FileController.UPLOADS_PATH, previousFilename);
  
      // Check if the file exists before attempting to unlink
      try {
        await fsPromises.access(previousFilePath);
        await fsPromises.unlink(previousFilePath);
      } catch (unlinkError) {
        // Handle the error, or ignore if the file doesn't exist
        if (unlinkError && unlinkError.code !== 'ENOENT') {
          FileController.logger.error(`Error deleting previous file '${previousFilePath}':`, unlinkError);
        }
      }
    }
  
    callback(null, uniqueFileName);
  }
  
  
}
