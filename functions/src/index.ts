import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { fetchAndStoreNews } from "./newsFetcher";
import { generateAudioForArticle } from "./ttsGenerator";

admin.initializeApp();

/**
 * Saatlik haber çekme - Her saat başı çalışır
 */
export const fetchNewsScheduled = functions
  .region("europe-west1")
  .pubsub.schedule("every 60 minutes")
  .onRun(async () => {
    functions.logger.info("Haber çekme başlatılıyor...");
    await fetchAndStoreNews();
    functions.logger.info("Haber çekme tamamlandı.");
  });

/**
 * Yeni haber eklendiğinde TTS üret
 */
export const onArticleCreated = functions
  .region("europe-west1")
  .firestore.document("articles/{articleId}")
  .onCreate(async (snap, context) => {
    const article = snap.data();
    if (article.audioUrl) return; // Zaten sesi var

    functions.logger.info(`TTS üretiliyor: ${context.params.articleId}`);
    await generateAudioForArticle(context.params.articleId, article);
  });

/**
 * Manuel haber çekme trigger (HTTP - test için)
 */
export const fetchNewsNow = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method not allowed");
      return;
    }
    await fetchAndStoreNews();
    res.json({ success: true, message: "Haberler çekildi." });
  });
