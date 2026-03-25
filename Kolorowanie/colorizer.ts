import type { Token, TokenType } from "./scanner";

const TOKEN_CLASS: Partial<Record<TokenType, string>> = {
  KEYWORD:      "keyword",
  NUMBER_INT:   "number",
  NUMBER_FLOAT: "number",
  IDENTIFIER:   "ident",
  OPERATOR:     "op",
  PUNCTUATION:  "punct",
  COMMENT:      "comment",
  ERROR:        "error",
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderToken(t: Token): string {
  if (t.type === "NEWLINE") return "\n";
  const cls = TOKEN_CLASS[t.type];
  const escaped = escapeHtml(t.value);
  return cls ? `<span class="${cls}">${escaped}</span>` : escaped;
}

export function colorize(tokens: Token[], filename = ""): string {
  const rawHtml = tokens.map(renderToken).join("");
  const lines = rawHtml.split("\n");

  const gutter = lines.map((_, i) => String(i + 1)).join("\n");
  const code = lines.join("\n");
  const title = filename ? `CalcLang — ${escapeHtml(filename)}` : "CalcLang";

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { background:#1e1e1e; color:#d4d4d4; font:14px/1.6 Consolas,monospace; margin:0; padding:20px; }
    h2   { color:#858585; font:13px sans-serif; margin-bottom:12px; }
    .wrap { display:flex; gap:0; }
    pre  { margin:0; white-space:pre; }
    .gutter { color:#858585; text-align:right; padding-right:16px; min-width:36px;
              user-select:none; border-right:1px solid #3a3a3a; margin-right:16px; }
    .keyword { color:#569cd6; font-weight:bold; }
    .number  { color:#b5cea8; }
    .ident   { color:#9cdcfe; }
    .op      { color:#d4d4d4; }
    .punct   { color:#ffd700; }
    .comment { color:#6a9955; font-style:italic; }
    .error   { color:#f44747; text-decoration:underline wavy; }
  </style>
</head>
<body>
  <h2>${title}</h2>
  <div class="wrap">
    <pre class="gutter">${gutter}</pre>
    <pre class="code">${code}</pre>
  </div>
</body>
</html>
`;
}
