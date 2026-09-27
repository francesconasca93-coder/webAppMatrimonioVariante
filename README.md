# Invito — variante a pannelli

Sito statico autonomo: nessuna build, nessuna dipendenza da installare. Basta
caricare questi file così come sono su un hosting statico (GitHub Pages, Netlify)
e funziona.

## Contenuto della cartella

```
index.html                              la pagina
variante-joy.css                        stile
variante-joy.js                         menu a pannello + foto che si alternano
script.js                               countdown, RSVP, animazioni (condiviso con l'altra variante)
foto/1.monastero_santa_colonna.jpg      foto del pannello, in ordine
foto/2.trani-cattedrale.jpg
foto/3.festa-luci.jpg
foto/4.corte-bracco.jpg
foto/og-image.jpg                       anteprima per WhatsApp / Facebook (1200×630)
```

Tutti i percorsi sono relativi: la cartella si può spostare o rinominare senza
toccare il codice. Font, mappe, Booking, Google Calendar, Google Photos e il
generatore di QR sono remoti e non richiedono file locali.

## Pubblicare su GitHub dal browser (senza clonare)

### Opzione A — repository nuovo, sito a `https<utente>.github.io/<repo>/`

1. GitHub → **New repository**, nome per esempio `invito-matrimonio-joy`,
   visibilità **Public** (GitHub Pages sui repo privati richiede un piano a
   pagamento), **Create repository**.
2. Nella pagina del repo vuoto: **uploading an existing file**
   (oppure **Add file → Upload files**).
3. Aprire questa cartella in Esplora file, selezionare **il contenuto**
   (`index.html`, i tre `.js`/`.css`, e la cartella `foto`) e trascinarlo nella
   pagina di GitHub. Non trascinare la cartella `variante-joy` stessa, altrimenti
   i file finiscono dentro un livello in più e `index.html` non sta alla radice.
   Trascinando la cartella `foto` GitHub ne mantiene il percorso.
4. **Commit changes**.
5. **Settings → Pages**: Source `Deploy from a branch`, Branch `main` / `/ (root)`,
   **Save**. Dopo un paio di minuti l'indirizzo compare in cima alla stessa pagina.

### Opzione B — sottocartella del repository già pubblicato

1. Nel repo esistente: **Add file → Upload files**.
2. Nel campo del percorso in alto, dopo il nome del repo, scrivere
   `variante-joy/` — GitHub crea la cartella al volo.
3. Trascinare il contenuto di questa cartella e fare **Commit changes**.
4. Il sito resta quello di prima; questa variante si raggiunge aggiungendo
   `/variante-joy/` all'indirizzo. I percorsi relativi funzionano identici.

> Attenzione in Opzione B: `script.js` esiste anche nella radice del repo ed è lo
> stesso file. Le due copie sono indipendenti, quindi una modifica va applicata a
> entrambe, altrimenti le due varianti divergono.

### Modifiche successive, sempre dal browser

Aprire il file su GitHub → icona della matita → modificare → **Commit changes**.
Per sostituire una foto: **Add file → Upload files** nella cartella `foto`,
caricando un file con lo stesso nome; GitHub lo sovrascrive.

## Prima di mandare il link agli invitati

- [ ] Sostituire `SITE_URL` nelle meta `og:` di `index.html` con il dominio reale
      (per esempio `https://utente.github.io/invito-matrimonio-joy`): gli scraper
      social non risolvono i percorsi relativi, l'anteprima serve assoluta.
- [ ] `foto/1.monastero_santa_colonna.jpg` è 274×184 px: a tutta altezza viene
      ingrandita 3–4× e si vede sfocata. Serve una versione da almeno 1200 px sul
      lato lungo.
- [ ] Dati ancora finti da sostituire: IBAN, i due numeri di telefono
      (`+39 333 000 000x`) e le due email `*.fake@email.it`.
- [ ] Due risposte delle FAQ sono marcate `[DA CONFERMARE]` (bambini e
      parcheggio; il parcheggio compare anche nella sezione Viaggio).
- [ ] Verificare la stima "circa 25 minuti in auto" dalla chiesa al ricevimento.
- [ ] Il form RSVP non invia nulla: `script.js` mostra solo il messaggio di
      conferma. Per ricevere davvero le risposte serve un servizio esterno
      (Formspree, Google Form, Netlify Forms) collegato all'`action` del form.

## Personalizzare

Colori, larghezza del pannello e della colonna di testo stanno nel blocco
`:root` all'inizio di `variante-joy.css` (`--ink`, `--paper`, `--clay`, `--sage`,
`--aux-w`, `--col`).

Per aggiungere una foto al pannello: un altro `<img class="aux-slide">` in
`index.html` dentro `.aux-art`, e il suo numero d'ordine nel `data-art` della
sezione da cui deve comparire. Il `data-tint` è il colore che quella foto presta
allo sfondo delle fasce. Le istruzioni per esteso sono nel commento HTML sopra
`.aux-art`.
