// src/file/file.service.ts

import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  private static readonly UPLOADS_PATH = path.join(process.cwd(), 'uploads');

  removeFile(filename: string): void {
    const filePath = this.getFilePath(filename);

    try {
      // Check if the file exists before attempting to remove it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`File ${filename} removed successfully.`);
      } else {
        console.log(`File ${filename} not found.`);
      }
    } catch (err) {
      console.error(`Error removing file ${filename}:`, err);
      throw new Error(`Error removing file ${filename}`);
    }
  }

  private getFilePath(filename: string): string {
    return path.join(FileService.UPLOADS_PATH, filename);
  }
}
