# AzureWithServiceTagsMiner

Extract the list of IP Ranges used by Azure Services on a specific Azure Cloud.

Known Azure Clouds:
- Public Cloud. https://www.microsoft.com/en-us/download/confirmation.aspx?id=56519
- China. https://www.microsoft.com/en-us/download/confirmation.aspx?id=57062
- US Government. https://www.microsoft.com/en-us/download/confirmation.aspx?id=57063
- Germany. https://www.microsoft.com/download/confirmation.aspx?id=57064

## Args

### `cloud`

One of:
- `PublicCloud`
- `ChinaCloud`
- `USGovernmentCloud`
- `GermanyCloud`

## Default filter

`[].endpoint`

## Sample output

Using filter `[?systemService=='AzureAD']`: [AzureWithServiceTagsMiner.json](AzureWithServiceTagsMiner.json)

## Output schema

[schemas/AzureWithServiceTagsMiner.schema.json](schemas/AzureWithServiceTagsMiner.schema.json)
