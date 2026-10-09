# Meyer API probe

Run: 2026-10-09T13:26:16.390Z · key length 36 · key looks like a GUID

## Discovery

- `https://meyerapi.meyerdistributing.com/` → 404 |  | non-JSON, 0 chars: 
- `https://meyerapi.meyerdistributing.com/http/default/ProdAPI/v2/swagger` → 404 |  | non-JSON, 0 chars: 
- `https://api.meyerdistributing.com/` → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: api.meyerdistributing.com:443, timeout: 10000ms)
- `https://online.meyerdistributing.com/api/` → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: online.meyerdistributing.com:443, timeout: 10000ms)

## https://meyerapi.meyerdistributing.com/http/default/ProdAPI/v2/

- no auth, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Espresso key:1, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Espresso key:1, ItemInventory?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Espresso key, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Espresso key, ItemInventory?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Bearer key, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Bearer key, ItemInventory?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- X-API-Key, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- X-API-Key, ItemInventory?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- ApiKey header, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- ApiKey header, ItemInventory?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)

## https://meyerapi.meyerdistributing.com/http/default/TestAPI/v2/

- no auth, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Espresso key:1, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Espresso key:1, ItemInventory?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Espresso key, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Espresso key, ItemInventory?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Bearer key, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Bearer key, ItemInventory?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- X-API-Key, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- X-API-Key, ItemInventory?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- ApiKey header, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- ApiKey header, ItemInventory?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)

## https://meyerapi.meyerdistributing.com/http/default/ProdAPI/v1/

- no auth, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Espresso key:1, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Espresso key:1, ItemInventory?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Espresso key, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Espresso key, ItemInventory?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Bearer key, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- Bearer key, ItemInventory?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- X-API-Key, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- X-API-Key, ItemInventory?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- ApiKey header, ItemInformation?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
- ApiKey header, ItemInventory?ItemNumber=BOS1000 → ERR UND_ERR_CONNECT_TIMEOUT: Connect Timeout Error (attempted address: meyerapi.meyerdistributing.com:443, timeout: 10000ms)
