import { connectToDB as connectToDB } from "@/lib/utils/db/connectToDB";
import { Post as Post } from "@/lib/models/post";
import { Tag as Tag } from "@/lib/models/tag";
import slugify from "slugify";
import { marked as marked, Marked as Marked } from "marked";
import { JSDOM as JSDOM } from "jsdom";
import createDOMPurify from "dompurify";
import Prism from "prismjs";
import { markedHighlight as markedHighlight } from "marked-highlight";
import AppError from "@/lib/utils/errorHandling/customError";
import { sessionInfo as sessionInfo } from "@/lib/serverMethods/session/sessionMethods";
import crypto from "crypto"
import sharp from "sharp";
import { File as File} from "node:buffer";
import { revalidatePath as revalidatePath} from "next/cache.js";
import { areTagsSimilar as areTagsSimilar, generateUniqueSlug as generateUniqueSlug} from "@/lib/utils/general/utils.js";
import { findOrCreateTag as findOrCreateTag} from "@/lib/serverMethods/tag/tagMethods";



export {
  connectToDB,
  Post,
  Tag,
  slugify,
  marked,
  Marked,
  JSDOM,
  createDOMPurify,
  Prism,
  markedHighlight,
  AppError,
  sessionInfo,
  crypto,
  sharp,
  File,
  revalidatePath,
  areTagsSimilar,
  generateUniqueSlug,
  findOrCreateTag
};
