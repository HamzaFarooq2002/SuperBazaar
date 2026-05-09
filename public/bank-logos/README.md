# Bank logos for Stock Now Pay Later via Bank

Drop bank logo files into this folder. The Stock Now Pay Later via Bank screens
(`BankFinancingSelection`, `BankFinancingConsent`, `BankFinancingOffer`,
`BankFinancingDashboard`, `PaymentsMain`) will pick them up automatically.

If a logo file is missing, a colored monogram fallback is shown — so you can
roll out logos one at a time without breaking the UI.

## File names (must match exactly)

| Bank                       | File name to drop here    |
|----------------------------|---------------------------|
| HBL                        | `hbl.png`                 |
| Meezan Bank                | `meezan.png`              |
| Bank Alfalah               | `alfalah.png`             |
| UBL                        | `ubl.png`                 |
| MCB                        | `mcb.png`                 |
| JS Bank                    | `jsbank.png`              |
| Allied Bank                | `abl.png`                 |
| Standard Chartered Bank    | `scb.png`                 |

To use a different filename or extension, edit the `logo` field for that bank
in `src/components/bankFinancing/bankBrands.tsx`.

## Recommended format

- **Type:** PNG with transparent background, or SVG.
- **Aspect:** square or near-square. The tile renders the asset at 78% of the
  tile, centered, with `object-fit: contain`, so wide logos won't be cropped
  but will look smaller.
- **Background:** transparent. The tile is white when a logo is present.
- **File size:** keep PNGs under 50 KB; SVGs ideally under 10 KB.
- **Color:** use the bank's official brand color so the logo reads on a white
  background.

## Where the mapping lives

`src/components/bankFinancing/bankBrands.tsx` defines:
- the file name expected for each bank,
- the brand color used for the monogram fallback,
- the 2–3 letter monogram shown when no logo file is found.

To support a new bank, add an entry there with `{ name, logo, color, initials }`
and add the bank to `BANKS` in `SuperBazaar_backend/superbazaar-backend/config/bankFinancingConfig.js`.

## How the fallback works

1. The `BankBrandTile` component tries to render `<img src="/bank-logos/<file>" />`.
2. If the request 404s (or the asset fails to decode), `onError` flips a state
   flag and the tile re-renders as a colored circle with monogram letters.
3. There is no extra config required — just drop the file in this folder.
