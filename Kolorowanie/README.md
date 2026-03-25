# Kolorowanie składni — CalcLang

Syntax colorizer for `.calc` files. Reads source code, outputs an HTML file with highlighted tokens.

## Uruchomienie

```
bun run index.ts <plik.calc> [wyjście.html]
```

Domyślny plik wyjściowy: `output.html`.

```
bun run index.ts example.calc output.html
```

## Tokeny

| Typ | Opis | Przykłady |
|-----|------|-----------|
| `KEYWORD` | Słowa kluczowe | `fun` `let` `if` `else` `return` |
| `NUMBER_INT` | Liczba całkowita | `0` `42` `1000` |
| `NUMBER_FLOAT` | Liczba zmiennoprzecinkowa | `3.14` `0.5` |
| `IDENTIFIER` | Nazwa zmiennej lub funkcji | `x` `square` `result` |
| `OPERATOR` | Operator | `+` `-` `*` `/` `%` `=` `==` `!=` `<` `>` `<=` `>=` |
| `PUNCTUATION` | Znaki strukturalne | `(` `)` `,` `;` |
| `COMMENT` | Komentarz jednoliniowy | `// treść` |
| `WHITESPACE` | Spacje i tabulatory | |
| `NEWLINE` | Koniec linii | |
| `ERROR` | Nierozpoznany znak | `@` `#` `` ` `` |
| `EOF` | Koniec pliku | |
