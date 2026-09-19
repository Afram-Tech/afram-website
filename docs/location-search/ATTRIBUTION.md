# Third-Party Data Attribution — Ghana Administrative Boundaries

## Source

- **Title:** Ghana - Subnational Administrative Boundaries
- **Original data:** Ghana Statistical Service (GSS)
- **Distributor:** UN Office for the Coordination of Humanitarian Affairs (OCHA), Field Information Services Section, via the Humanitarian Data Exchange (HDX)
- **Dataset URL:** https://data.humdata.org/dataset/cod-ab-gha
- **File retrieved:** `gha_admin_boundaries.geojson.zip`
- **Retrieval date:** 2026-09-19
- **Source file SHA-256:** `fbc2a72af2bfc928045031aff76e36fab49dea48e858a4ac640d7070d2dc1e22`
- **Dataset version / validity date:** boundaries valid since 2021-03-08 (COD-AB v01); last reviewed for accuracy 30 October 2025; HDX metadata last modified 2026-08-14

## License

**Creative Commons Attribution for Intergovernmental Organisations 3.0 (CC BY-IGO 3.0)**

- Full legal text: http://creativecommons.org/licenses/by/3.0/igo/legalcode
- Commercial use is permitted, with attribution.
- Distribution must include a copy of, or a link to, this license.

## What we changed

The shipped files (`src/data/boundaries/gha-admin1.geojson`, `gha-admin2.geojson`) are **derivative works**, not the original dataset:

1. **Simplified** with topology preserved (`mapshaper -simplify weighted 100% keep-shapes planar -clean`) — this step removes essentially no points on its own; its purpose is building shared-edge topology across adjacent districts and repairing any gaps/overlaps, not reducing detail.
2. **Coordinates quantised** to 4 decimal places (~11m at this latitude) on output, which is the actual size-reduction step.
3. **Attributes dropped** to only: `adm1_pcode`/`adm2_pcode` (p-code), `adm1_name`/`adm2_name` (official name), `adm1_pcode` as parent reference on the district layer, and `center_lat`/`center_lon` (centroid). Everything else the source carries (multilingual name variants, `valid_on`/`valid_to`, `area_sqkm`, dataset `version`, `adm0_*` country fields) was removed.
4. **Admin0 (country outline), admin capitals, admin lines, and the "\_em" (enhanced multilingual) variants** in the source zip were not used at all.

Measured effect of steps 1–2, source vertex to nearest point on the simplified boundary: **max 4.6m (regions), max 6.0m (districts)**, both dominated by coordinate quantisation rather than shape simplification. Full numbers, including which specific region/district is worst, are reproduced by running `bun run build:boundaries` (see `scripts/build-boundaries.ts`, which regenerates these files from the source URL above and prints the same report).

## Regenerating

Nothing under `src/data/boundaries/` is hand-edited. Run:

```
bun run build:boundaries
```

This re-downloads the source from the URL above, verifies it against the pinned SHA-256, and re-runs the exact pipeline described here. A hash mismatch means HDX has published a newer version of the dataset since this was pinned — the script refuses to proceed silently; see the header comment in `scripts/build-boundaries.ts` for the `--update-pin` path once the change has been reviewed.

## Required credit line (user-facing)

Wherever this boundary data is shown to a user (map view, location picker, etc.), display:

> Administrative boundaries: Ghana Statistical Service, via UN OCHA (CC BY-IGO 3.0)

Do not state or imply that GSS, OCHA, or the UN endorse Afram or any Afram product. This is a factual attribution of the data's origin, not an endorsement.

## No-endorsement statement

This attribution is provided solely to comply with the CC BY-IGO 3.0 license's attribution requirement. Afram is not affiliated with, and this data's use does not imply endorsement by, the Ghana Statistical Service, the United Nations, or UN OCHA.
