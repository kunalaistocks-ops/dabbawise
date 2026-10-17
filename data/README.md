# Food Truths evidence staging — 17 October 2026

The CSV in this folder contains **four US-market preliminary product-label records** transcribed from manufacturers' publicly accessible product pages on 17 October 2026. Each row is marked `verified=false` and has no `reviewed_at`. They must not be imported as verified or displayed as independently validated nutritional recommendations.

Source pages:
- Original Cheerios: https://www.cheerios.com/products/original-cheerios
- Multi Grain Cheerios: https://www.cheerios.com/products/multi-grain-cheerios
- Goldfish Cheddar 28g snack pack: https://goldfishsmiles.com/crackers/cheddar-cheese-crackers/
- Goldfish Whole Grain Cheddar 30g: https://goldfishsmiles.com/whole-grain/baked-with-whole-grain-cheddar-baked-snack-crackers/

Before promotion to verified, an independent reviewer must confirm current packaging, market and formulation, serving size and weight, ingredient and allergen declarations, measured nutrient values, evidence URL, capture date and the actual reviewed package variant. Manufacturer page text alone is not enough to establish current on-shelf labelling.

**Data handling:** Unknown values are blank, not zero. Goldfish Cheddar fibre is listed as less than 1g on the official page; the numeric draft field is intentionally blank because the existing DB schema cannot encode an inequality. Do not confuse added sugars with total sugars.

**India:** A current, attributable nutrition panel for specific Indian-market SKUs is still needed before populating any India values. Cross-border or historic manufacturer materials are not sufficient. No Indian product information was fabricated.

No production database inserts occurred in preparing these records. This is a review queue, not a published catalogue.
