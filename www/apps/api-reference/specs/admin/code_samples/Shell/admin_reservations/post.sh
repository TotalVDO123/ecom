curl -X POST '{backend_url}/admin/reservations' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "line_item_id": "{value}",
  "location_id": "{value}",
  "inventory_item_id": "{value}",
  "quantity": 1182065915592704,
  "description": "{value}",
  "metadata": {}
}'