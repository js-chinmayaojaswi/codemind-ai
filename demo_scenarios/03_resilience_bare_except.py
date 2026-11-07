# DEMO SCENARIO 3: Mutable Defaults & Silent Fault Masking
# Background: Postmortem Post-991 identified bare excepts masking Redis connection drops.

import logging
import httpx

logger = logging.getLogger(__name__)

# ❌ ANTI-PATTERN 1: Mutable default parameter dictionary retains mutation across function calls
def dispatch_event_batch(events: list, telemetry_context: dict = {}):
    telemetry_context["batch_size"] = len(events)
    
    # ❌ ANTI-PATTERN 2: Outbound HTTP request without explicit timeout hangs worker indefinitely
    client = httpx.Client()
    response = client.post("https://ingest.datadog.com/v1/input", json={"data": events})
    
    try:
        return response.json()
    except:
        # ❌ ANTI-PATTERN 3: Bare except catches SystemExit, KeyboardInterrupt, and masks stack traces
        logger.error("Failed to parse response")
        return None
