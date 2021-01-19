# AWSIPRangesMiner

Extract the list of ip ranges used by AWS Services from the official feed: https://ip-ranges.amazonaws.com/ip-ranges.json

## Args

*None*

## Default filter

`[].endpoint`

## Sample output

Using filter `[?region=='eu-south-1']`: [AWSIPRangesMiner.json](AWSIPRangesMiner.json)

## Output schema

[schemas/AWSIPRangesMiner.schema.json](schemas/AWSIPRangesMiner.schema.json)
