import os
from mastodon import Mastodon  # type: ignore
from typing import Tuple, Any

OAUTH_SCOPES = ["read:follows", "read:lists", "write:lists"]
REDIRECT_URIS = "urn:ietf:wg:oauth:2.0:oob"


def create_app(name: str, api_base_url: str):
    Mastodon.create_app(
        name,
        scopes=OAUTH_SCOPES,
        redirect_uris=REDIRECT_URIS,
        api_base_url=api_base_url,
    )


def get_app():
    api_base_url = os.getenv("API_BASE_URL")
    assert api_base_url is not None

    access_token = os.getenv("USER_ACCESS_TOKEN")

    if access_token is None:
        client_id = os.getenv("CLIENT_KEY")
        assert client_id is not None

        client_secret = os.getenv("CLIENT_SECRET")
        assert client_secret is not None

        mastodon_app = Mastodon(
            client_id=client_id,
            client_secret=client_secret,
            api_base_url=api_base_url,
        )
        return mastodon_app
    else:
        mastodon_app = Mastodon(
            access_token=access_token,
            api_base_url=api_base_url,
        )
        return mastodon_app


def oauth_login(code: str) -> str:
    mastodon_app = get_app()
    oauth_authorisation_code = os.getenv("OAUTH_AUTHORISATION_CODE")
    access_token = mastodon_app.log_in(code=code, scopes=OAUTH_SCOPES)
    return access_token


def get_oauth_url() -> str:
    client_id = os.getenv("CLIENT_KEY")
    assert client_id is not None

    mastodon_app = get_app()

    oauth_url = mastodon_app.auth_request_url(
        client_id=client_id,
        scopes=OAUTH_SCOPES,
    )
    return oauth_url


def get_lists():
    mastodon_app = get_app()
    return mastodon_app.lists()


def get_follows():
    mastodon_app = get_app()
    return mastodon_app.follows()
