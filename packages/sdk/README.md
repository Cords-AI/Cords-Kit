# Cords API SDK

The Cords API SDK provides a convenient way to interact with the Cords API, offering a set of methods to perform various operations such as searching, fetching related resources, and retrieving individual resources. This SDK is designed to simplify the process of integrating Cords API functionalities into your applications.

## Installation

You can install the SDK using npm or any other package manager:

```bash
npm install @cords/sdk
```

## Usage

### Initialization

First, import the `CordsAPI` function and initialize it with your API key:

```javascript
import { CordsAPI } from "@cords/sdk";

const cords = CordsAPI({ apiKey: "your_api_key_here" });
```

### Searching

To perform a search, use the `search` method. You can pass a query string and optional search options:

```ts
const results = await cords.search("query", {
	page: 1,
	lat: 40.7128,
	lng: -74.006,
	distance: 10,
	pageSize: 20,
	filter: {
		211: true,
		mentor: true,
		prosper: true,
		magnet: true,
	},
});
```

### Fetching Related Resources

To fetch resources related to a specific resource, use the `related` method:

```ts
const relatedResources = await cords.related("resource_id");
```

### Retrieving a Single Resource

To retrieve a single resource by its ID, use the `resource` method:

```ts
const resource = await cords.resource("resource_id");
```

### Fetching Multiple Resources

To fetch multiple resources by their IDs, use the `resourceList` method:

```ts
const resources = await cords.resourceList(["resource_id_1", "resource_id_2"]);
```

### Formatting Service Address

The SDK also includes a utility function to format service addresses:

```ts
import { formatServiceAddress } from "@cords/sdk";

const formattedAddress = formatServiceAddress(resource.data.address)
```