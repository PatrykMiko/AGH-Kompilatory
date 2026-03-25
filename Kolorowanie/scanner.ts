/**
 * Tabela tokenów dla języka CalcLang (.calc)
 *
 * | Typ tokenu   | Opis                              | Przykłady               |
 * |--------------|-----------------------------------|-------------------------|
 * | KEYWORD      | Słowo kluczowe                    | fun let if else return  |
 * | NUMBER_INT   | Liczba całkowita                  | 0  42  1000             |
 * | NUMBER_FLOAT | Liczba zmiennoprzecinkowa         | 3.14  0.5  2.71828      |
 * | IDENTIFIER   | Nazwa zmiennej lub funkcji        | x  myVar  silnia        |
 * | OPERATOR     | Operator arytmetyczny/relacyjny   | + - * / = == != < > <= >=|
 * | PUNCTUATION  | Znaki strukturalne                | ( ) , ;                 |
 * | COMMENT      | Komentarz jednoliniowy            | // treść do końca linii |
 * | WHITESPACE   | Spacje i tabulatory               | (space) \t              |
 * | NEWLINE      | Koniec linii                      | \n                      |
 * | ERROR        | Nierozpoznany znak                | @ # `                   |
 * | EOF          | Koniec pliku                      |                         |
 */

export type TokenType =
  | "KEYWORD"
  | "NUMBER_INT"
  | "NUMBER_FLOAT"
  | "IDENTIFIER"
  | "OPERATOR"
  | "PUNCTUATION"
  | "COMMENT"
  | "WHITESPACE"
  | "NEWLINE"
  | "ERROR"
  | "EOF";

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

const KEYWORDS = new Set(["fun", "let", "if", "else", "return"]);

const TWO_CHAR_OPS = new Set(["==", "!=", "<=", ">="]);

/**
 * Diagram przejść skanera:
 *
 *  START ──(spacja/\t)────► WHITESPACE ──(spacja/\t)──► WHITESPACE
 *                                        ──(inny)──────► [emit WHITESPACE] → START
 *        ──(\n)─────────► [emit NEWLINE] → START
 *        ──(cyfra)──────► INT ──(cyfra)──► INT
 *                              ──('.')───► FLOAT ──(cyfra)──► FLOAT
 *                                                 ──(inny)──► [emit NUMBER_FLOAT] → START
 *                              ──(inny)──► [emit NUMBER_INT] → START
 *        ──(litera/_)───► IDENT ──(litera/cyfra/_)──► IDENT
 *                               ──(inny)─────────────► [KEYWORDS? → emit KEYWORD : emit IDENTIFIER] → START
 *        ──('/')────────► SLASH ──('/')──► COMMENT ──(znak≠\n)──► COMMENT
 *                                                   ──(\n/EOF)──► [emit COMMENT] → START
 *                               ──(inny)──► [emit OPERATOR '/'] → START
 *        ──(2-znakowy op)──────► [emit OPERATOR] → START
 *        ──(1-znakowy op)──────► [emit OPERATOR] → START
 *        ──(interpunkcja)──────► [emit PUNCTUATION] → START
 *        ──(inny)──────────────► [emit ERROR] → START
 */
export class Scanner {
  private pos = 0;
  private line = 1;
  private col = 1;

  constructor(private source: string) {}

  private peek(offset = 0): string | null {
    const idx = this.pos + offset;
    return idx < this.source.length ? this.source[idx]! : null;
  }

  private advance(): string {
    const ch = this.source[this.pos++]!;
    if (ch === "\n") { this.line++; this.col = 1; }
    else { this.col++; }
    return ch;
  }

  nextToken(): Token {
    if (this.pos >= this.source.length) {
      return { type: "EOF", value: "", line: this.line, column: this.col };
    }

    const line = this.line;
    const col = this.col;
    const ch = this.peek()!;

    if (ch === "\n") {
      this.advance();
      return { type: "NEWLINE", value: "\n", line, column: col };
    }

    if (ch === " " || ch === "\t" || ch === "\r") {
      let val = "";
      while (this.peek() === " " || this.peek() === "\t" || this.peek() === "\r")
        val += this.advance();
      return { type: "WHITESPACE", value: val, line, column: col };
    }

    if (ch === "/") {
      if (this.peek(1) === "/") {
        let val = "";
        while (this.peek() !== null && this.peek() !== "\n")
          val += this.advance();
        return { type: "COMMENT", value: val, line, column: col };
      }
      return { type: "OPERATOR", value: this.advance(), line, column: col };
    }

    if (ch >= "0" && ch <= "9") {
      let val = "";
      while (this.peek() !== null && this.peek()! >= "0" && this.peek()! <= "9")
        val += this.advance();
      if (this.peek() === "." && this.peek(1) !== null && this.peek(1)! >= "0" && this.peek(1)! <= "9") {
        val += this.advance();
        while (this.peek() !== null && this.peek()! >= "0" && this.peek()! <= "9")
          val += this.advance();
        return { type: "NUMBER_FLOAT", value: val, line, column: col };
      }
      return { type: "NUMBER_INT", value: val, line, column: col };
    }

    if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_") {
      let val = "";
      while (this.peek() !== null && /[a-zA-Z0-9_]/.test(this.peek()!))
        val += this.advance();
      return { type: KEYWORDS.has(val) ? "KEYWORD" : "IDENTIFIER", value: val, line, column: col };
    }

    const two = ch + (this.peek(1) ?? "");
    if (TWO_CHAR_OPS.has(two)) {
      this.advance(); this.advance();
      return { type: "OPERATOR", value: two, line, column: col };
    }

    if ("+-*%=<>!".includes(ch))
      return { type: "OPERATOR", value: this.advance(), line, column: col };

    if ("(),;".includes(ch))
      return { type: "PUNCTUATION", value: this.advance(), line, column: col };

    return { type: "ERROR", value: this.advance(), line, column: col };
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    while (true) {
      const t = this.nextToken();
      tokens.push(t);
      if (t.type === "EOF") break;
    }
    return tokens;
  }
}
