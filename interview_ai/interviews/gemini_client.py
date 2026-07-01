from google import genai
from google.genai.errors import ClientError, ServerError
from django.conf import settings
import time

# List of API keys from settings.py
API_KEYS = settings.GEMINI_API_KEYS


def generate_text(prompt):
    """
    Try every Gemini API key until one succeeds.
    If a key hits quota or is invalid, move to the next key.
    """

    last_error = None

    for key in API_KEYS:
        try:
            print(f"Trying key: {key[:12]}...")

            client = genai.Client(api_key=key)

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            print(f"Success with key: {key[:12]}...")
            return response.text

        except ClientError as e:
            print(f"Client Error ({key[:12]}...): {e}")
            last_error = e
            continue

        except ServerError as e:
            print(f"Server Error ({key[:12]}...): {e}")
            last_error = e

            # Wait a little before trying next key
            time.sleep(2)
            continue

        except Exception as e:
            print(f"Unexpected Error ({key[:12]}...): {e}")
            last_error = e
            continue

    raise Exception(f"All Gemini API keys failed.\n{last_error}")