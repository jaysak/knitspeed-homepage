# Unique Product Extraction Summary

## Source
data/raw/gsc_sales_2026.xlsx

## Extraction Results
- Total sales rows processed: 7,798
- Unique product patterns extracted: 346

## Dominant Product Families
### Single Jersey
- 30CMSJ/365
- 30SMSJ/365
- 32SMSJ/365
- 20CMSJ/365
- 30TD104SJ/365
- 30CVCSJ/375

### RIB
- 30CMRB/32
- 20CMRB/19
- 20CMRB/32
- 30CMRB2/32
- 30SMRB32
- 20OEWRB/32

### Interlock
- 45TC80/20IT/84
- 40SEMI INT/37

## Initial Naming Pattern Findings

### Structure Codes
- SJ = Single Jersey
- RB = RIB
- IT = Interlock

### Composition Indicators
- CM likely Cotton Combed
- CVC = Chief Value Cotton
- TC80/20 = Tetron Cotton 80/20
- TD104 = specific blend/category

### Width Encoding
Examples:
- /365 = 36.5"
- /32 = 32"
- /375 = 37.5"

### Data Cleanup Requirements
- remove leading asterisks
- normalize spaces
- normalize quote symbols
- normalize width formatting
- unify duplicate naming styles

## Business Insight
The sales distribution clearly shows repeated production-standard SKUs.
This validates the feasibility of building:
- products_master
- dynamic dropdowns
- standardized textile taxonomy
- future forecasting systems

## Subtask 2.2 Status
Completed.

## Next Step
Subtask 2.3 — Decode Naming Structure.
