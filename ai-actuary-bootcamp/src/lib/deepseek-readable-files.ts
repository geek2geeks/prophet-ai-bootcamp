type FileLike = {
  name: string;
  type?: string | null;
};

export const DEEPSEEK_READABLE_FILE_EXTENSIONS = [
  ".txt",
  ".md",
  ".csv",
  ".tsv",
  ".json",
  ".yaml",
  ".yml",
  ".xml",
  ".html",
  ".htm",
  ".log",
  ".ini",
  ".cfg",
  ".toml",
  ".py",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".sql",
  ".css",
  ".java",
  ".go",
  ".rs",
  ".sh",
].join(",");

const DEEPSEEK_READABLE_FILE_SUFFIXES = DEEPSEEK_READABLE_FILE_EXTENSIONS.split(",");

const DEEPSEEK_READABLE_FILE_TYPES = new Set([
  "application/json",
  "application/ld+json",
  "application/sql",
  "application/xml",
  "text/csv",
  "text/css",
  "text/html",
  "text/javascript",
  "text/markdown",
  "text/plain",
  "text/tab-separated-values",
  "text/x-python",
  "text/xml",
]);

export const DEEPSEEK_READABLE_FILE_SUMMARY =
  ".txt, .md, .csv, .json, .xml, .yaml, .html, .sql e ficheiros de codigo";

export function isDeepSeekReadableTextFile(file: FileLike) {
  const fileType = file.type?.trim().toLowerCase() ?? "";
  const fileName = file.name.trim().toLowerCase();

  if (fileType.startsWith("text/")) {
    return true;
  }

  if (DEEPSEEK_READABLE_FILE_TYPES.has(fileType)) {
    return true;
  }

  return DEEPSEEK_READABLE_FILE_SUFFIXES.some((suffix) => fileName.endsWith(suffix));
}

export function getDeepSeekReadableFileError(contextLabel = "Este upload") {
  return `${contextLabel} so aceita ficheiros de texto que o DeepSeek 3.2 consiga ler diretamente: ${DEEPSEEK_READABLE_FILE_SUMMARY}.`;
}
