Hej!

## Uruchamianie

Serwer: `npm run server`

Frontend: `npm run dev`

## Decyzje/założenia

- wysyłam progress przy każdym progressie gracza:

```

        if (data.type === "progress") {
            player.progress = data.progress;
            ...
            broadcastPlayerList();
        }
```

dla małego typeracera chyba lepiej, minimalny lag - gdyby był większy, lepiej wysyłać bulkowo co ~100ms, żeby za bardzo nie spamować eventami

- słowo = 5 znaków licząc WPM
- JWT do zapisywania statystyk - nie potrzebujemy bazy, możemy zapisywać lokalnie u użytkownika więc nie znika przy resecie serwera, sprytny użytkownik nie może ręcznie tweakować sobie statystyk
- shadcn data table do implementacji sortowalnej tablicy - bo to dużo szybsze niż pisanie własnej
- Fastify jako backend - bo chciałem się go nauczyć, chociaż tutaj rola serwera i tak jest minimalna, więc mogłoby być cokolwiek
- monorepo - szybciej i mogę wysłać rozwiązanie w jednym repo

## AI

Z dużych kawałków kodu, chat GPT wygenerował mi tylko komponent tabelki z shadcna. Napisał też zdania do wpisywania.

## Prod

- MainTonikRacer jest duży (jak na małą apke), można dla czytelności rozbić UI na mniejsze komponenty (teraz też nie jest źle, bo i tak nie ma duplikatów kodu, ale robi się nieczytelnie), a logikę wydzielić do hooka od komunikacji przez WS - tak bym pewnie zrobił w "normalnej apce".
- Zabezpieczenie przed oszustwami, najłatwiej sprawdzając czy eventy są trusted, chociaż to da się ominąć - chyba najlepiej zrobić captche z jakimś zakłóconym tekstem do przepisania na czas, wydaje mi się że na typeracerze tak jest.
- zdockeryzować to
- podbicie fastify-websocket, bo obecna wersja jest deprecated

## Issues

Dołączony użytkownik pojawia się podwójnie - prawie na pewno przez to, że na devie useEffecty odpalają się podwójnie, więc łączymy się podwójnie, po zbudowaniu powinno zniknąć, ale nie budowałem więc nie jestem pewien.
