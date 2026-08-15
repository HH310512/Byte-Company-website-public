# Byte Company — website

Broncode van [bytecompany.nl](https://bytecompany.nl). Statische site, geen build-stap: elke pagina is een op zichzelf staand html-bestand met eigen CSS en JavaScript erin.

## Bestanden

| Bestand | Wat het is |
|---|---|
| `index.html` | Homepage |
| `diensten.html` | Diensten (automatisering, dashboards, apps, websites) + FAQ |
| `over-ons.html` | Verhaal, tijdlijn, werkwijze |
| `contact.html` | Contactgegevens + formulier (Formspree) |
| `logo.png` | Logo in de navigatie |
| `favicon.ico` / `favicon.png` | Browserpictogram |
| `og-image.jpg` / `og-image.png` | Preview-afbeelding bij het delen van links (1200×630) |
| `sitemap.xml` | Pagina-overzicht voor Google |
| `robots.txt` | Instructies voor zoekmachines, verwijst naar de sitemap |
| `CNAME` | Koppelt GitHub Pages aan bytecompany.nl — **laten staan** |

## Lokaal werken (VS Code)

1. Open deze map in VS Code.
2. Bekijken kan door een html-bestand in de browser te openen, maar handiger is de extensie **Live Server**: rechtsklik op `index.html` → "Open with Live Server". De pagina ververst dan vanzelf bij elke wijziging.
3. Let op: het contactformulier verstuurt ook lokaal echt — testberichten komen gewoon binnen.

## Wijzigingen live zetten

De site draait op GitHub Pages (repo `Byte-Company-website-public`, branch `main`). Gewijzigde bestanden uploaden of committen naar `main` is genoeg; na 1–2 minuten staat het live. Hard verversen in de browser (Cmd+Shift+R) om de cache te omzeilen.

Na inhoudelijke wijzigingen: `lastmod` in `sitemap.xml` bijwerken en de sitemap opnieuw indienen in Google Search Console.

## Afspraken die in de code verwerkt zitten

- **Dienstvolgorde is overal**: automatisering, dashboards, apps, websites — ook in het contactformulier.
- **Nergens een e-mailadres** op de site; contact loopt via het formulier (endpoint staat in `contact.html`, variabele `FORM_ENDPOINT`; het ontvangstadres stel je in bij Formspree zelf).
- **Geen prijzen of vaste-prijsbeloftes**; de werkwijze (verkenning → stappen met elk een eigen afspraak) staat in de FAQ op `diensten.html`. De zichtbare FAQ en de FAQ-data in de `<script type="application/ld+json">` moeten gelijk blijven.
- **Open Graph-tags** staan per pagina in de `<head>`; previews worden door platforms gecachet (verversen via LinkedIn Post Inspector).
- De JSON-LD staat bewust op één regel (meerdere regels braken eerder previews op iOS).

## Huisstijl in het kort

CSS-variabelen staan bovenin elke pagina:

```css
--pine:#0E3B36;  --pine-deep:#0A2E29;  --mint:#7FE8C3;  --mint-tint:#DDF7EC;
--mint-dark:#14574C;  --ink:#131A18;  --mist:#F4F7F6;  --slate:#5E6E69;  --line:#E1E8E5;
```

Spelregels: mint nooit als tekstkleur op wit (gebruik `--mint-dark`); logo-groen `#13E0A5` is exclusief voor het beeldmerk; sans voor tekst, mono voor labels/kickers.
