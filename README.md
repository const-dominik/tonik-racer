Hello!

## Running

server: `npm run server`
front: `npm run dev`

## Decyzje

- wysyłam progress przy każdym progressie gracza:

````
        if (data.type === "progress") {
            player.progress = data.progress;

            broadcastPlayerList();
        }
```

dla małego typeracera chyba lepiej, minimalny lag - gdyby był większy, lepiej wysyłać bulkowo co ~100ms, żeby za bardzo nie spamować eventami
````
