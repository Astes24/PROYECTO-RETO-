#!/usr/bin/env bash
# Smoke del flujo completo (lead -> whatsapp -> cita -> estado -> panel).
# Uso: bash scripts/smoke.sh   (requiere el backend en :3001)
set -uo pipefail

API="${API:-http://localhost:3001/api}"
OUT="$(mktemp)"
PHONE="+599$(date +%s | rev | cut -c1-7 | rev)"
FECHA="$(date +%F)"
FAIL=0

pass() { printf '  ok   %s\n' "$1"; }
bad()  { printf '  FAIL %s\n' "$1"; FAIL=1; }

# req <metodo> <ruta> <json|->  -> imprime el codigo HTTP
req() {
  local method="$1" path="$2" body="${3:--}"
  if [ "$body" = "-" ]; then
    curl -s -o "$OUT" -w '%{http_code}' -X "$method" "$API$path"
  else
    curl -s -o "$OUT" -w '%{http_code}' -X "$method" "$API$path" \
      -H 'Content-Type: application/json' -d "$body"
  fi
}

# expect <esperado> <obtenido> <etiqueta>
expect() {
  if [ "$1" = "$2" ]; then pass "$3 ($2)"; else bad "$3 (esperado $1, obtuvo $2)"; fi
}

json() { python3 -c "import sys,json;d=json.load(sys.stdin);print($1)" < "$OUT" 2>/dev/null || echo ""; }

echo "== Mini Praxia smoke =="

expect 200 "$(req GET /health)" "GET /health"

# 1. crear lead
expect 201 "$(req POST /leads "{\"nombre\":\"Smoke Test\",\"telefono\":\"$PHONE\",\"fuente\":\"web\"}")" "POST /leads"
LEAD_ID="$(json "d['data']['id']")"

# 2. telefono duplicado
expect 400 "$(req POST /leads "{\"nombre\":\"Smoke Dup\",\"telefono\":\"$PHONE\"}")" "POST /leads duplicado"

# 3. crear cita
expect 201 "$(req POST /citas "{\"lead_id\":$LEAD_ID,\"fecha\":\"$FECHA\",\"hora_inicio\":\"08:00\",\"hora_fin\":\"08:30\",\"motivo\":\"Smoke\"}")" "POST /citas"
CITA_ID="$(json "d['data']['id']")"

# 4. horario duplicado
expect 400 "$(req POST /citas "{\"lead_id\":$LEAD_ID,\"fecha\":\"$FECHA\",\"hora_inicio\":\"08:00\",\"hora_fin\":\"08:30\",\"motivo\":\"Smoke dup\"}")" "POST /citas duplicada"

# 5. cambio de estado
expect 200 "$(req PATCH "/citas/$CITA_ID/estado" '{"estado":"confirmada"}')" "PATCH estado"

# 6. whatsapp entrante + repetido
expect 201 "$(req POST /whatsapp/webhook "{\"telefono\":\"$PHONE\",\"mensaje\":\"smoke mensaje\"}")" "POST /whatsapp/webhook"
expect 400 "$(req POST /whatsapp/webhook "{\"telefono\":\"$PHONE\",\"mensaje\":\"smoke mensaje\"}")" "POST /whatsapp/webhook repetido"

# 7. panel
expect 200 "$(req GET /dashboard/resumen)" "GET /dashboard/resumen"
TOTAL="$(json "d['data']['totalLeads']")"
[ -n "$TOTAL" ] && pass "resumen.totalLeads=$TOTAL" || bad "resumen sin totalLeads"

# 8. 404 en JSON
CODE="$(req GET /ruta-que-no-existe)"
expect 404 "$CODE" "404 JSON"

# limpieza (borra citas y mensajes en cascada)
req DELETE "/leads/$LEAD_ID" >/dev/null

echo
if [ "$FAIL" = 0 ]; then echo "SMOKE OK"; else echo "SMOKE FALLÓ"; fi
rm -f "$OUT"
exit "$FAIL"
