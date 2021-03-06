# mm-cloud-services-miners

`jtschichold/mm-cloud-services-miners` action is a GitHub Action that can extract list of IP prefixes and URL endpoints used by Cloud Providers/Cloud Services from a variety of sources.

## Example usage

Create the action config YML file in your repo. Let's call it `mm-cloud-services-config.yml` (it could be anything):

```yaml
azuread:
  - name: mine azure
    miner: AzureWithServiceTagsMiner
    outputs:
      - resultPath: ./AzureAD.json
        filter: "[?systemService=='AzureAD']"
```

In the GitHub Action workflow configure the action to use the config file:

```yaml
uses: jtschichold/mm-cloud-services-miners@5090b71
with:
    config: ./mm-cloud-services-config.yml
    configSection: azuread
```

When executed, the action generates a file called `AzureAD.json` with the list of IP Prefixes used for the service `AzureAD` taken from the official Azure Service With Tags feed.

## Inputs

### `config`

*Required*

Path to the config file. See below for the format of the config file.

### `configSection`

*Required*

Name of the section in the config file to be used.

## Config file format

The config file is a YAML file with all the details about which sources/APIs should be queried.

### `<section_name>`

The config file is a `map` of sections. Each section is a list of mining configurations.

When configuring the action you need to specify the path to the config file in the `config` input and the name of the section to execute in the `configSection` input.

### `<section_name>[*].name`

Name of the mining configuration. 

### `<section_name>[*].miner`

Name of the miner to use. Each miner gives access to a specific source/API. See below for the list of supported miners.

### `<section_name>[*].args`

A `map` of the arguments for the miner. Each miner supports specific arguments, see below in the Miners section.

### `<section_name>[*].outputs`

A `list` of outputs to be generated from the miner results.

### `<section_name>[*].outputs[*].resultPath`

Name of the file to save the result into in JSON format.

### `<section_name>[*].outputs[*].filter`

A JMESPath filter to be applied to the results of the miner. If no filter is specified, the default filter is applied.

### Example

[./__tests__/test-config.yml](./__tests__/test-config.yml)

## Available miners

|Miner|||
|-|-|-|
| AdobeCreativeMiner | Extract the list of Adobe Creative Cloud Network Endpoints. | [Documentation](docs/AdobeCreativeMiner.md) |
| AWSIPRangesMiner | Extract the list of ip ranges used by AWS Services. | [Documentation](docs/AWSIPRangesMiner.md) |
| AzureWithServiceTagsMiner | Extract the list of IP Ranges used by Azure Services on a specific Azure Cloud. | [Documentation](docs/AzureWithServiceTagsMiner.md) |
| BGPViewASNPrefixMiner | Extract BGP prefixes announced by an AS from BGPView API. | [Documentation](docs/BGPViewASNPrefixMiner.md) |
| GoogleCloudNetblocksMiner | Extract the list of Google Clod IP ranges. | [Documentation](docs/GoogleCloudNetblocksMiner.md) |
| GoogleNetblocksMiner | Extract the list of Google Services IP ranges. | [Documentation](docs/GoogleNetblocksMiner.md) |
| O365Miner | Extract the list of O365 endpoints. | [Documentation](docs/O365Miner.md) |
| RADBASRegisterdRoutesMiner | Scrape routes registered by an AS from RADB web interface. | [Documentation](docs/RADBASRegisterdRoutesMiner.md) |

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
