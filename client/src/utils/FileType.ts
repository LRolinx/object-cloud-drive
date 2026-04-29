export type PreviewFileType =
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'text'
  | 'code'
  | 'markdown'
  | 'html'
  | 'word'
  | 'excel'
  | 'ppt'
  | 'archive'
  | 'package'
  | 'database'
  | 'design'
  | 'torrent'
  | 'unknown';

type FileTypeInfo = {
  type: PreviewFileType;
  iconStr: string;
};

const FILE_TYPE_BY_EXTENSION: Record<string, FileTypeInfo> = {
  // Images
  png: { type: 'image', iconStr: 'icon-pic' },
  jpg: { type: 'image', iconStr: 'icon-pic' },
  jpeg: { type: 'image', iconStr: 'icon-pic' },
  gif: { type: 'image', iconStr: 'icon-pic' },
  webp: { type: 'image', iconStr: 'icon-pic' },
  avif: { type: 'image', iconStr: 'icon-pic' },
  svg: { type: 'image', iconStr: 'icon-pic' },
  bmp: { type: 'image', iconStr: 'icon-pic' },
  ico: { type: 'image', iconStr: 'icon-pic' },
  tif: { type: 'image', iconStr: 'icon-pic' },
  tiff: { type: 'image', iconStr: 'icon-pic' },
  eps: { type: 'image', iconStr: 'icon-pic' },
  exr: { type: 'image', iconStr: 'icon-pic' },
  tga: { type: 'image', iconStr: 'icon-pic' },

  // Video
  mp4: { type: 'video', iconStr: 'icon-video' },
  webm: { type: 'video', iconStr: 'icon-video' },
  mkv: { type: 'video', iconStr: 'icon-video' },
  avi: { type: 'video', iconStr: 'icon-video' },
  wmv: { type: 'video', iconStr: 'icon-video' },
  m4v: { type: 'video', iconStr: 'icon-video' },
  mov: { type: 'video', iconStr: 'icon-video' },
  asf: { type: 'video', iconStr: 'icon-video' },
  flv: { type: 'video', iconStr: 'icon-video' },
  f4v: { type: 'video', iconStr: 'icon-video' },
  rmvb: { type: 'video', iconStr: 'icon-video' },
  rm: { type: 'video', iconStr: 'icon-video' },
  '3gp': { type: 'video', iconStr: 'icon-video' },
  vob: { type: 'video', iconStr: 'icon-video' },
  mpeg: { type: 'video', iconStr: 'icon-video' },
  mpg: { type: 'video', iconStr: 'icon-video' },

  // Audio
  mp3: { type: 'audio', iconStr: 'icon-music' },
  aac: { type: 'audio', iconStr: 'icon-music' },
  m4a: { type: 'audio', iconStr: 'icon-music' },
  wav: { type: 'audio', iconStr: 'icon-music' },
  ogg: { type: 'audio', iconStr: 'icon-music' },
  oga: { type: 'audio', iconStr: 'icon-music' },
  opus: { type: 'audio', iconStr: 'icon-music' },
  alac: { type: 'audio', iconStr: 'icon-music' },
  flac: { type: 'audio', iconStr: 'icon-music' },
  ape: { type: 'audio', iconStr: 'icon-music' },
  wma: { type: 'audio', iconStr: 'icon-music' },

  // Text and source code
  txt: { type: 'text', iconStr: 'icon-txt' },
  log: { type: 'text', iconStr: 'icon-txt' },
  csv: { type: 'text', iconStr: 'icon-txt' },
  json: { type: 'code', iconStr: 'icon-code' },
  xml: { type: 'code', iconStr: 'icon-code' },
  yaml: { type: 'code', iconStr: 'icon-code' },
  yml: { type: 'code', iconStr: 'icon-code' },
  js: { type: 'code', iconStr: 'icon-code' },
  jsx: { type: 'code', iconStr: 'icon-code' },
  ts: { type: 'code', iconStr: 'icon-code' },
  tsx: { type: 'code', iconStr: 'icon-code' },
  css: { type: 'code', iconStr: 'icon-css' },
  less: { type: 'code', iconStr: 'icon-css' },
  scss: { type: 'code', iconStr: 'icon-css' },
  sass: { type: 'code', iconStr: 'icon-css' },
  py: { type: 'code', iconStr: 'icon-code' },
  cs: { type: 'code', iconStr: 'icon-code' },
  java: { type: 'code', iconStr: 'icon-code' },
  kt: { type: 'code', iconStr: 'icon-code' },
  go: { type: 'code', iconStr: 'icon-code' },
  rs: { type: 'code', iconStr: 'icon-code' },
  c: { type: 'code', iconStr: 'icon-code' },
  cpp: { type: 'code', iconStr: 'icon-code' },
  cc: { type: 'code', iconStr: 'icon-code' },
  cxx: { type: 'code', iconStr: 'icon-code' },
  h: { type: 'code', iconStr: 'icon-code' },
  hpp: { type: 'code', iconStr: 'icon-code' },
  sh: { type: 'code', iconStr: 'icon-code' },
  bash: { type: 'code', iconStr: 'icon-code' },
  zsh: { type: 'code', iconStr: 'icon-code' },
  ps1: { type: 'code', iconStr: 'icon-code' },
  php: { type: 'code', iconStr: 'icon-code' },
  rb: { type: 'code', iconStr: 'icon-code' },
  swift: { type: 'code', iconStr: 'icon-code' },
  dart: { type: 'code', iconStr: 'icon-code' },
  lua: { type: 'code', iconStr: 'icon-code' },
  vue: { type: 'code', iconStr: 'icon-code' },
  svelte: { type: 'code', iconStr: 'icon-code' },
  sql: { type: 'code', iconStr: 'icon-code' },
  md: { type: 'markdown', iconStr: 'icon-md' },
  markdown: { type: 'markdown', iconStr: 'icon-md' },
  html: { type: 'html', iconStr: 'icon-html' },
  htm: { type: 'html', iconStr: 'icon-html' },

  // Databases
  db: { type: 'database', iconStr: 'icon-database' },
  db3: { type: 'database', iconStr: 'icon-database' },
  sqlite: { type: 'database', iconStr: 'icon-database' },
  sqlite3: { type: 'database', iconStr: 'icon-database' },

  // Documents
  pdf: { type: 'pdf', iconStr: 'icon-pdf' },
  doc: { type: 'word', iconStr: 'icon-word' },
  docx: { type: 'word', iconStr: 'icon-word' },
  rtf: { type: 'word', iconStr: 'icon-word' },
  xls: { type: 'excel', iconStr: 'icon-excel' },
  xlsx: { type: 'excel', iconStr: 'icon-excel' },
  ods: { type: 'excel', iconStr: 'icon-excel' },
  ppt: { type: 'ppt', iconStr: 'icon-ppt' },
  pptx: { type: 'ppt', iconStr: 'icon-ppt' },
  odp: { type: 'ppt', iconStr: 'icon-ppt' },

  // Archives and installers
  zip: { type: 'archive', iconStr: 'icon-zip' },
  jar: { type: 'archive', iconStr: 'icon-zip' },
  '7z': { type: 'archive', iconStr: 'icon-zip' },
  rar: { type: 'archive', iconStr: 'icon-zip' },
  tar: { type: 'archive', iconStr: 'icon-zip' },
  gz: { type: 'archive', iconStr: 'icon-zip' },
  bz2: { type: 'archive', iconStr: 'icon-zip' },
  xz: { type: 'archive', iconStr: 'icon-zip' },
  dmg: { type: 'package', iconStr: 'icon-package' },
  exe: { type: 'package', iconStr: 'icon-windows' },
  msi: { type: 'package', iconStr: 'icon-windows' },
  apk: { type: 'package', iconStr: 'icon-Android-hover' },
  deb: { type: 'package', iconStr: 'icon-package' },
  rpm: { type: 'package', iconStr: 'icon-package' },

  // Other common formats
  psd: { type: 'design', iconStr: 'icon-design' },
  ai: { type: 'design', iconStr: 'icon-design' },
  sketch: { type: 'design', iconStr: 'icon-design' },
  fig: { type: 'design', iconStr: 'icon-design' },
  xmind: { type: 'design', iconStr: 'icon-xmind' },
  torrent: { type: 'torrent', iconStr: 'icon-bt' },
  bt: { type: 'torrent', iconStr: 'icon-bt' },
};

const getExtension = (item: any) =>
  String(item?.suffix || item?.ext || item?.fileExt || item?.file_ext || '')
    .trim()
    .replace(/^\./, '')
    .toLowerCase();

export const GetFileTypeInItem = (item: any): FileTypeInfo => {
  const extension = getExtension(item);
  if (extension && FILE_TYPE_BY_EXTENSION[extension]) {
    return FILE_TYPE_BY_EXTENSION[extension];
  }

  if (item?.mediaType === 'video') {
    return { type: 'video', iconStr: 'icon-video' };
  }
  if (item?.mediaType === 'audio') {
    return { type: 'audio', iconStr: 'icon-music' };
  }

  const mime = String(item?.fileType || '').toLowerCase();
  if (mime.startsWith('image/')) {
    return { type: 'image', iconStr: 'icon-pic' };
  }
  if (mime.startsWith('video/')) {
    return { type: 'video', iconStr: 'icon-video' };
  }
  if (mime.startsWith('audio/')) {
    return { type: 'audio', iconStr: 'icon-music' };
  }
  if (mime === 'application/pdf') {
    return { type: 'pdf', iconStr: 'icon-pdf' };
  }
  if (mime.startsWith('text/')) {
    return { type: 'text', iconStr: 'icon-txt' };
  }

  return { type: 'unknown', iconStr: 'icon-unknown' };
};
