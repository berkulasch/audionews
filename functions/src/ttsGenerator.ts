import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import OpenAI from "openai";
import { Readable } from "stream";

const db = admin.firestore();
const storage = admin.storage();

export async function generateAudioForArticle(
  articleId: string,
  articleData: admin.firestore.DocumentData
): Promise<void> {
  const apiKey = functions.config().openai?.key;
  if (!apiKey) {
    functions.logger.warn("OpenAI API key bulunamadı. TTS atlandı.");
    return;
  }

  const openai = new OpenAI({ apiKey });

  // TTS için metin oluştur - başlık + özet
  const text = `${articleData.title}. ${articleData.summary}`;

  // Metni 4096 karakterle sınırla (OpenAI TTS limiti)
  const truncatedText = text.length > 4000 ? text.substring(0, 4000) + "..." : text;

  try {
    functions.logger.info(`TTS isteği gönderiliyor: ${articleId}`);

    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "onyx", // Türkçe için en iyi ses
      input: truncatedText,
      speed: 1.0,
    });

    // Audio dosyasını buffer olarak al
    const audioBuffer = Buffer.from(await mp3Response.arrayBuffer());

    // Firebase Storage'a yükle
    const bucket = storage.bucket();
    const fileName = `audio/${articleId}.mp3`;
    const file = bucket.file(fileName);

    await file.save(audioBuffer, {
      metadata: {
        contentType: "audio/mpeg",
        metadata: {
          articleId,
          generatedAt: new Date().toISOString(),
        },
      },
    });

    // Public URL al
    await file.makePublic();
    const audioUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Ses süresini tahmin et (yaklaşık 150 kelime/dakika)
    const wordCount = truncatedText.split(" ").length;
    const estimatedDurationSecs = Math.ceil((wordCount / 150) * 60);

    // Firestore'u güncelle
    await db.collection("articles").doc(articleId).update({
      audioUrl,
      duration: estimatedDurationSecs,
      audioGeneratedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    functions.logger.info(`TTS tamamlandı: ${articleId} → ${audioUrl}`);
  } catch (error) {
    functions.logger.error(`TTS hatası (${articleId}):`, error);
  }
}

/**
 * ElevenLabs alternatif TTS (daha doğal ses, Türkçe desteği)
 */
export async function generateAudioElevenLabs(
  articleId: string,
  text: string,
  voiceId = "pNInz6obpgDQGcFmaJgB" // Adam voice
): Promise<string | null> {
  const apiKey = functions.config().elevenlabs?.key;
  if (!apiKey) return null;

  const truncated = text.length > 5000 ? text.substring(0, 5000) : text;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: truncated,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    functions.logger.error("ElevenLabs hatası:", await response.text());
    return null;
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  const bucket = storage.bucket();
  const fileName = `audio/${articleId}_elevenlabs.mp3`;
  const file = bucket.file(fileName);

  await file.save(audioBuffer, {
    metadata: { contentType: "audio/mpeg" },
  });
  await file.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}
