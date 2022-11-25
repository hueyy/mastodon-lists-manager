import os
import db
import mas
import typer

app = typer.Typer()


def init_lists():
    print(mas.get_lists())


def init():
    client_id = db.get_client_id()
    client_secret = db.get_client_secret()
    if client_id is None or client_secret is None:
        # create app
        pass
        return
    oauth_authorisation_code = db.get_oauth_code()
    if oauth_authorisation_code is None:
        # prompt for oauth code, otherwise
        # oauth authorise
        print("Visit the following URL to authorise the app", mas.get_oauth_url())
        print("Run app.py again when you have authorised the app")
        return
    access_token = db.get_access_token()
    if access_token is None:
        # prompt for access token, otherwise
        # oauth login
        access_token = mas.oauth_login(oauth_authorisation_code)
        db.set_access_token(access_token)
    init_lists()


if __name__ == "__main__":
    typer.run(init)
