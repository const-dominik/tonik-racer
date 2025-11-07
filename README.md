Hello!

## Running

server: `npm run server`
front: `npm run dev`

## Decyzje/założenia

- wysyłam progress przy każdym progressie gracza:

```

        if (data.type === "progress") {
            player.progress = data.progress;

            broadcastPlayerList();
        }
```

dla małego typeracera chyba lepiej, minimalny lag - gdyby był większy, lepiej wysyłać bulkowo co ~100ms, żeby za bardzo nie spamować eventami

- słowo = 5 znaków licząc WPM

## Prod

- od początku podział backendu i frontendu zamiast forsowanie tego w jednym repo,
- zabezpieczenie przed oszustwami, najłatwiej sprawdzając czy eventy są trusted, chociaż to da się ominąć - chyba najlepiej zrobić captche z jakimś zakłóconym tekstem do przepisania na czas, chyba na typeracerze tak jest
