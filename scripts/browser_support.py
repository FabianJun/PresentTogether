"""Use Playwright's installed Chromium, with an optional local override."""
import os


def browser_options():
    executable = os.environ.get('BROWSER_EXECUTABLE')
    return {'executable_path': executable} if executable else {}
