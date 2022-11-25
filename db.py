from pysondb import db  # type: ignore

DATABASE_FILE = "db.json"


class KEYS:
    USER_ACCESS_TOKEN = "USER_ACCESS_TOKEN"
    OAUTH_AUTHORISATION_CODE = "OAUTH_AUTHORISATION_CODE"
    CLIENT_ID = "CLIENT_ID"
    CLIENT_SECRET = "CLIENT_SECRET"


def get_value(key: str):
    d = db.getDb(DATABASE_FILE)
    try:
        return d.find(f"KEY-{key}")
    except db.IdNotFoundError:
        return None


def set_value(key: str, value: str):
    d = db.getDb(DATABASE_FILE)
    db.updateById(f"KEY-{key}", value)


def get_access_token():
    return get_value(KEYS.USER_ACCESS_TOKEN)


def set_access_token(value: str):
    return set_value(KEYS.USER_ACCESS_TOKEN, value)


def get_oauth_code():
    return get_value(KEYS.OAUTH_AUTHORISATION_CODE)


def set_oauth_code(value: str):
    return set_value(KEYS.OAUTH_AUTHORISATION_CODE, value)


def get_client_id():
    return get_value(KEYS.CLIENT_ID)


def set_client_id(value: str):
    return set_value(KEYS.CLIENT_ID, value)


def get_client_secret():
    return get_value(KEYS.CLIENT_SECRET)


def set_client_secret(value: str):
    return set_value(KEYS.CLIENT_SECRET, value)
