class Skaner:
    def __init__(self, tekst):
        self.tekst = tekst
        self.pozycja = 0
        self.kolumna = 1
        self.aktualny_znak = self.tekst[self.pozycja] if self.tekst else None

    def przesun(self):
        self.pozycja += 1
        self.kolumna += 1
        if self.pozycja >= len(self.tekst):
            self.aktualny_znak = None
        else:
            self.aktualny_znak = self.tekst[self.pozycja]

    def pomijaj_biale_znaki(self):
        while self.aktualny_znak is not None and self.aktualny_znak.isspace():
            self.przesun()

    def skanuj_liczbe(self):
        wynik = ''
        start_kolumna = self.kolumna
        while self.aktualny_znak is not None and self.aktualny_znak.isdigit():
            wynik += self.aktualny_znak
            self.przesun()
        return ('INT', int(wynik), start_kolumna)

    def skanuj_identyfikator(self):
        wynik = ''
        start_kolumna = self.kolumna
        while self.aktualny_znak is not None and self.aktualny_znak.isalnum():
            wynik += self.aktualny_znak
            self.przesun()
        return ('ID', wynik, start_kolumna)

    def skaner(self):
        while self.aktualny_znak is not None:

            if self.aktualny_znak.isspace():
                self.pomijaj_biale_znaki()
                continue

            start_kolumna = self.kolumna

            if self.aktualny_znak.isdigit():
                return self.skanuj_liczbe()

            if self.aktualny_znak.isalpha():
                return self.skanuj_identyfikator()

            if self.aktualny_znak == '+':
                self.przesun()
                return ('PLUS', '+', start_kolumna)
            if self.aktualny_znak == '-':
                self.przesun()
                return ('MINUS', '-', start_kolumna)
            if self.aktualny_znak == '*':
                self.przesun()
                return ('MUL', '*', start_kolumna)
            if self.aktualny_znak == '/':
                self.przesun()
                return ('DIV', '/', start_kolumna)
            if self.aktualny_znak == '(':
                self.przesun()
                return ('LPAREN', '(', start_kolumna)
            if self.aktualny_znak == ')':
                self.przesun()
                return ('RPAREN', ')', start_kolumna)

            bledny_znak = self.aktualny_znak
            self.przesun()
            return ('ERROR', f"Nierozpoznany znak '{bledny_znak}'", start_kolumna)

        return ('END', None, self.kolumna)


def main():
    wyrazenie = "2+3*(76+8/3)+ 3*(9-3) + x - @"
    print(f"Skanowane wyrażenie:\n{wyrazenie}\n")
    print(f"{'KOD':<8} | {'WARTOŚĆ':<15} | {'KOLUMNA'}")
    print("-" * 40)

    skaner_obj = Skaner(wyrazenie)

    while True:
        kod, wartosc, kolumna = skaner_obj.skaner()

        if kod == 'END':
            print("-" * 40)
            print(f"Zakończono. Koniec wyrażenia w kolumnie {kolumna}.")
            break
        elif kod == 'ERROR':
            print(f"Błąd skanera: {wartosc} (w kolumnie {kolumna})")
        else:
            print(f"{kod:<8} | {str(wartosc):<15} | {kolumna}")


if __name__ == '__main__':
    main()
