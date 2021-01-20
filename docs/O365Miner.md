# O365Miner

Extract the list of O365 endpoints from official Microsoft Web Service: https://docs.microsoft.com/en-us/microsoft-365/enterprise/microsoft-365-ip-web-service

## Environment variables

Request to Microsoft Web Service Endpoint require a unique GUID per client. The miner expects an environment variable named `O365MINER_CLIENT_GUID`. This should be stored as a secret in your GitHub repo and then recalled in the GitHub Action workflow:

```yaml
name: mine O365
uses: jtschichold/mm-cloud-services-miners@50e3bb4
with:
  config: ./cs-mining-config.yml
  configSection: o365
env:
  O365MINER_CLIENT_GUID: ${{ secrets.GUID }}
```

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
