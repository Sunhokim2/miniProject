import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // 환경 변수 로드
  const env = process.env;
  
  // index.html 파일 경로
  const indexPath = path.resolve(__dirname, 'dist', 'index.html');
  
  console.log(`Checking for file: ${indexPath}`);
  
  if (!fs.existsSync(indexPath)) {
    console.error(`File does not exist: ${indexPath}`);
    process.exit(1);
  }
  
  // index.html 파일 읽기
  let html = fs.readFileSync(indexPath, 'utf8');
  
  console.log(`Original HTML length: ${html.length}`);
  console.log(`VITE_NAVER_CLIENT_ID: ${env.VITE_NAVER_CLIENT_ID || 'not set'}`);
  
  // 환경 변수 치환 (모든 출현을 변경)
  const replacedHtml = html.replace(
    /%VITE_NAVER_CLIENT_ID%/g,
    env.VITE_NAVER_CLIENT_ID || '발급받은_클라이언트_ID'
  );
  
  console.log(`Replaced HTML length: ${replacedHtml.length}`);
  
  // 수정된 내용 저장
  fs.writeFileSync(indexPath, replacedHtml);
  
  console.log('Environment variables have been injected into index.html');
} catch (error) {
  console.error('Error processing the file:', error);
  process.exit(1);
} 