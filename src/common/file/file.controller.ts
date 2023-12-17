import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { validationResult } from 'express-validator';
import * as mimeTypes from 'mime-types';
import * as path from 'path';
import * as fs from 'fs';

@Controller('/api/v1/image')
export class FileController {

  @Get()
  async test() {
    return 'test';
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: path.join(__dirname, '../../uploads'),
      filename: (req, file, callback) => {
        // Use the previous filename if available in the query parameters, otherwise generate a new one
        const previousFilename = req.query.previousFilename as string || '';
        console.log('previousFilename', previousFilename);
        const timestamp = new Date().getTime();
        const uniqueFileName = `${file.originalname}-${timestamp}${extname(file.originalname)}`;

        // Delete the previous file if a previous filename is provided
        if (previousFilename && previousFilename !== '') {
          const previousFilePath = path.join(__dirname, '../../uploads', previousFilename);
          fs.unlinkSync(previousFilePath);
        }

        return callback(null, uniqueFileName);
      },
    }),
    limits: {
      fileSize: 1024 * 1024 * 5,  // 5 MB file size limit
    },
  }))
  async uploadFile(@UploadedFile() file, @Query('previousFilename') previousFilename) {
    try {
      // Custom validation using express-validator functions
      const errors = validationResult(file);
      if (!errors.isEmpty()) {
        throw new BadRequestException(errors.array().map(error => error.msg).join(', '));
      }

      // Validate file type
      const mimeType = mimeTypes.lookup(file.originalname);
      if (!mimeType || !['image/jpeg', 'image/png'].includes(mimeType)) {
        throw new BadRequestException('Invalid file type. Only JPEG and PNG are allowed.');
      }

      // The file is now available on the local server, and you can save its information to the database or perform other actions.
      return { filename: file.filename };
    } catch (error) {
      // Log the error
      console.error('Error uploading file:', error.message);
      throw error;  // Rethrow the error for global exception handling, if any
    }
  }
}
