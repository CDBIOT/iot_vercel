// =========================================================
// api/upload.js
// Coloque este arquivo em uma pasta "api" na RAIZ do seu
// projeto React (mesmo nível de "src" e "package.json"):
//
//   meu-projeto/
//   ├── src/
//   ├── public/
//   ├── api/
//   │   └── upload.js   <-- este arquivo
//   └── package.json
//
// A Vercel detecta a pasta "api" automaticamente e publica
// cada arquivo como uma função serverless em:
//   https://seu-site.vercel.app/api/upload
//
// Isso funciona independente do framework do front-end
// (React puro, Vite, CRA, etc.) — não precisa ser Next.js.
//
// Instalação da dependência (rode onde você edita o projeto
// — pode ser no GitHub Codespaces, ou qualquer lugar que não
// seja o computador com restrição):
//   npm install @vercel/blob
//
// No painel da Vercel:
//   Storage > Create Database > Blob > conectar ao projeto
//   (cria a variável BLOB_READ_WRITE_TOKEN automaticamente)
//   Settings > Environment Variables > adicionar API_KEY
// =========================================================

import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'método não permitido' });
  }

  // Autenticação simples via chave no header
  const chaveRecebida = req.headers['x-api-key'];
  if (chaveRecebida !== process.env.API_KEY) {
    return res.status(401).json({ erro: 'não autorizado' });
  }

  // Lê o corpo da requisição em bytes (a imagem JPEG crua enviada pelo ESP32)
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const imagemBuffer = Buffer.concat(chunks);

  if (imagemBuffer.length === 0) {
    return res.status(400).json({ erro: 'nenhuma imagem recebida' });
  }

  const nomeArquivo = `esp32cam/${Date.now()}.jpg`;

  const resultadoBlob = await put(nomeArquivo, imagemBuffer, {
    access: 'public',
    contentType: 'image/jpeg',
  });

  console.log('Imagem recebida e salva em:', resultadoBlob.url);

  // ---------------------------------------------------------
  // OPCIONAL: para reconhecimento de objetos, chame aqui uma
  // API de visão computacional em nuvem (Google Cloud Vision,
  // Azure Computer Vision, Roboflow, AWS Rekognition), passando
  // resultadoBlob.url ou imagemBuffer, e devolva o resultado
  // junto na resposta abaixo.
  // ---------------------------------------------------------

  return res.status(200).json({
    status: 'ok',
    url: resultadoBlob.url,
  });
}
