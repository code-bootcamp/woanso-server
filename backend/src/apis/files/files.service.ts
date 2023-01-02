import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { IFilesServiceUpload } from './interfaces/files.service.interface';
import { getToday } from 'src/commons/libraries/utils';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  async upload({ files }: IFilesServiceUpload): Promise<string[]> {
    const waitedFiles = await Promise.all(files);

    // 1-1) 스토리지 셋팅하기
    const bucket = process.env.BUCKET;
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT,
      keyFilename: process.env.GCP_PROJECT_KEY_FILE,
    }).bucket(bucket);

    // 1-2) 스토리지에 파일 올리기
    const results = await Promise.all(
      waitedFiles.map(
        (el) =>
          new Promise<string>((resolve, reject) => {
            const fname = `${getToday()}/${uuidv4}/origin/${el.filename}`;

            el.createReadStream()
              .pipe(storage.file(el.filename).createWriteStream())
              .on('finish', () => resolve(`${bucket}/${fname}`))
              .on('error', () => reject('실패'));
          }),
      ),
    );

    // 2. 다운로드URL 브라우저에 돌려주기
    return results;
  }
  async uploadOne({ file }) {
    const bucket = process.env.BUCKET;
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT,
      keyFilename: process.env.GCP_PROJECT_KEY_FILE,
    }).bucket(bucket);

    const fname = `${getToday()}/${uuidv4()}/origin/${file.filename}`;
    const result = await new Promise((resolve, reject) => {
      file
        .createReadStream()
        .pipe(storage.file(fname).createWriteStream())
        .on('finish', () => resolve(`${bucket}/${fname}`))
        .on('error', () => reject('false'));
    });
    if (result === 'false') {
      throw new HttpException('이미지 업로드 오류', HttpStatus.CONFLICT);
    }
    return result;
  }
}
