import multer from "multer";
import * as dotenv from "dotenv";
import * as GCS from "@google-cloud/storage";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const gcsStorage = new GCS.Storage({
  keyFilename: process.env.GCS_KEY_FILENAME,
  projectId: process.env.GCS_ID,
});

export const pfpBucket = gcsStorage.bucket(process.env.GCS_PFP_BUCKET);

export const attachmentBucket = gcsStorage.bucket(
  process.env.GCS_ATTACHMENT_BUCKET
);

export const callBucket = gcsStorage.bucket(process.env.GCS_CALL_BUCKET);

export const uploadHandler = multer({
  storage: multer.memoryStorage(),
});

const pfpBucketName = process.env.GCS_PFP_BUCKET;
const attachmentBucketName = process.env.GCS_ATTACHMENT_BUCKET;
const callBucketName = process.env.GCS_CALL_BUCKET;

export function getPfpLink(name) {
  return `https://storage.googleapis.com/${pfpBucketName}/${name}`;
}
export function getAttachmentLink(name) {
  return `https://storage.googleapis.com/${attachmentBucketName}/${name}`;
}
export function getCallLink(name) {
  return `https://storage.googleapis.com/${callBucketName}/${name}`;
}

export function getFileName(link) {
  if (
    new RegExp(
      `^https://storage.googleapis.com/${attachmentBucketName}/.+$`
    ).test(link)
  ) {
    return link.substring(
      `https://storage.googleapis.com/${attachmentBucketName}/`.length
    );
  } else if (
    new RegExp(`^https://storage.googleapis.com/${pfpBucketName}/.+$`).test(
      link
    )
  ) {
    return link.substring(
      `https://storage.googleapis.com/${pfpBucketName}/`.length
    );
  } else if (
    new RegExp(`^https://storage.googleapis.com/${callBucketName}/.+$`).test(
      link
    )
  ) {
    return link.substring(
      `https://storage.googleapis.com/${callBucketName}/`.length
    );
  }
  return null;
}
