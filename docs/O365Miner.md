# O365Miner

Extract the list of O365 endpoints from official Microsoft Web Service: https://docs.microsoft.com/en-us/microsoft-365/enterprise/microsoft-365-ip-web-service

## Args

### `instance`

One of:
- `Worldwide`
- `USGovDoD`
- `USGovGCCHigh`
- `China`
- `Germany`

## Default filter

`[?endpointType=='IP'].endpoint`

## Sample output

Using filter `[]`: [O365Miner.json](O365Miner.json)

## Output schema

[schemas/O365Miner.schema.json](schemas/O365Miner.schema.json)
