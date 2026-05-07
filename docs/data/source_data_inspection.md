# Source Data Inspection — GSC Sales 2026

## File
data/raw/gsc_sales_2026.xlsx

## Sheet
Sheet 1

## Total Rows
7,798

## Useful Columns
- Dfabdate: delivery/sales date
- Dlvno: invoice/delivery number
- Clothid: internal cloth ID
- Clothno: raw product code/name
- Ftype: fabric type
- Fwidth: fabric width
- Custid: customer ID
- Custname: customer name
- Shadedesc: shade description
- Colorno: color name/code
- Kgprice: price per kg
- Sumkg: total kg
- Sumprice: total amount
- Billid: billing document
- Payid: payment document

## Initial Clothno Examples
- 45TC80/20IT/84
- 34TKRB/36
- 30CVCSJ/375
- * 20TC80-20 SJ/43
- *20TC80-20RB/32
- 45TC80/20 IT/44
- 45TCขนหนู
- 30CMSJ/38
- 30CMRB/32
- 30CMSJ/365
- 30TD104SJ/365

## Initial Observations
- Clothno is the main raw product naming field.
- Ftype provides useful structure labels such as Interlock, RIB, Single Jersey.
- Fwidth stores width values such as 84", 36", 37.5", etc.
- Some Clothno values include spaces, asterisks, Thai text, and mixed abbreviations.
- Naming cleanup is required before building products_master.
- Data appears suitable for extracting real product taxonomy.

## Subtask 2.1 Status
Completed.

## Next Step
Subtask 2.2 — Extract Unique Product Names.
