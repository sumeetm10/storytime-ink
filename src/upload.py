"""Upload a video to YouTube using the Data API v3 OAuth flow."""
import pickle
from pathlib import Path

from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    # Read-only analytics, so the pipeline can report impressions/CTR itself.
    "https://www.googleapis.com/auth/yt-analytics.readonly",
    "https://www.googleapis.com/auth/youtube.readonly",
]

# YouTube rejects the request if the combined length of all tags exceeds ~500
# characters (a multi-word tag is counted with surrounding quotes). Trim to a
# safe budget, keeping the earlier (more relevant) tags.
def _clamp_tags(tags, budget=460):
    out, used = [], 0
    for tag in tags or []:
        tag = tag.strip()
        if not tag:
            continue
        cost = len(tag) + (2 if " " in tag else 0) + 1  # quotes + comma
        if used + cost > budget:
            break
        out.append(tag)
        used += cost
    return out


def _credentials(client_secret_path, token_path):
    client_secret_path = Path(client_secret_path)
    token_path = Path(token_path)

    if not client_secret_path.exists():
        raise RuntimeError(
            f"client_secret.json not found at {client_secret_path}. "
            "Copy the OAuth client file from Google Cloud Console "
            "(same steps as footy-shorts/SETUP.md)."
        )

    creds = None
    if token_path.exists():
        with open(token_path, "rb") as f:
            creds = pickle.load(f)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                str(client_secret_path), SCOPES
            )
            # access_type=offline guarantees a refresh token is issued;
            # prompt forces the account + channel chooser so the wrong account
            # can't be silently reused and a refresh token is always returned.
            creds = flow.run_local_server(
                port=0, access_type="offline", prompt="select_account consent"
            )
        with open(token_path, "wb") as f:
            pickle.dump(creds, f)
    return creds


def authenticate(cfg):
    """Trigger the OAuth flow and mint token.json without uploading anything.

    Used by `python main.py --login` to re-mint a long-lived refresh token
    after publishing the OAuth app to production.
    """
    root = cfg["_root"]
    return _credentials(root / "client_secret.json", root / "token.json")


def upload(cfg, video_path, title, description, tags, privacy=None,
           thumb_path=None, publish_at=None, expect_channel=None):
    root = cfg["_root"]
    creds = _credentials(root / "client_secret.json", root / "token.json")
    youtube = build("youtube", "v3", credentials=creds)
    if expect_channel:
        # the wrong-account upload of 2026-07 must not happen again
        mine = youtube.channels().list(part="snippet", mine=True).execute()["items"][0]["snippet"]["title"]
        if mine.replace(" ", "").lower() != expect_channel.replace(" ", "").lower():
            raise RuntimeError(f"logged in to '{mine}', not '{expect_channel}' - not uploading")

    body = {
        "snippet": {
            "title": title[:100],
            "description": description[:5000],
            "tags": _clamp_tags(tags),
            "categoryId": cfg["channel"]["category_id"],
            "defaultLanguage": cfg["channel"]["default_language"],
            "defaultAudioLanguage": cfg["channel"]["default_language"],
        },
        "status": {
            "privacyStatus": privacy or cfg["youtube"]["privacy_status"],
            "selfDeclaredMadeForKids": cfg["youtube"]["made_for_kids"],
        },
    }

    if publish_at:
        # scheduled: private until publish_at (RFC3339, UTC), then public by itself
        body["status"]["privacyStatus"] = "private"
        body["status"]["publishAt"] = publish_at
    media = MediaFileUpload(
        video_path, chunksize=-1, resumable=True, mimetype="video/mp4"
    )
    req = youtube.videos().insert(
        part="snippet,status", body=body, media_body=media
    )

    resp = None
    while resp is None:
        _status, resp = req.next_chunk()
    video_id = resp["id"]

    # Set the custom thumbnail. Needs a verified channel; if not, YouTube
    # returns an error — don't let that fail the whole upload.
    if thumb_path and Path(thumb_path).exists():
        try:
            youtube.thumbnails().set(
                videoId=video_id,
                media_body=MediaFileUpload(str(thumb_path), mimetype="image/jpeg"),
            ).execute()
            print("      custom thumbnail set")
        except Exception as e:
            print(f"      [warn] thumbnail not set ({e}). "
                  "Verify the channel at youtube.com/verify to enable custom "
                  "thumbnails, or set it manually in Studio.")

    return video_id
