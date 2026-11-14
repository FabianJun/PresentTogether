"""Check tracked paths, local documentation links and exported document contents.

Complements a real secret scanner; it is not a proof that arbitrary files are safe.
Stage the intended files first. No matched secret value is printed.
"""
import json
import re
import subprocess
import zipfile
from pathlib import Path
from urllib.parse import unquote

import pymupdf
from pptx import Presentation

ROOT = Path(__file__).resolve().parents[1]
files = subprocess.check_output(['git', 'ls-files', '-z'], cwd=ROOT).decode('utf-8').split('\0')
files = [Path(p) for p in files if p]
assert files, 'Stage the intended public files first.'
failures = []
forbidden_dirs = {'data', 'backups', 'artifacts', 'output', '.openai', 'node_modules', '.venv'}
rules = {
    'local-user-path': re.compile(r'[A-Z]:[/\\]Users[/\\]', re.I),
    'private-URL': re.compile(r'(?:#|&|\?)\s*(?:host|speaker|access_token|api_key)=[A-Za-z0-9_-]{16,}'),
    'private-key': re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
}


def inspect(text, label):
    for name, pattern in rules.items():
        if pattern.search(text):
            failures.append(f'{label}: {name}')


for relative in files:
    path = ROOT / relative
    if forbidden_dirs.intersection(relative.parts) or path.suffix in {'.sqlite', '.db', '.pem', '.key', '.zip', '.gz'} or path.name.startswith('.env'):
        failures.append(f'{relative}: private/generated path')
    if path.stat().st_size > 95 * 1024 * 1024:
        failures.append(f'{relative}: too large for normal GitHub storage')
    if path.suffix == '.pptx':
        with zipfile.ZipFile(path) as archive:
            assert archive.testzip() is None
            for entry in archive.namelist():
                if entry.endswith(('.xml', '.rels')):
                    inspect(archive.read(entry).decode('utf-8'), str(relative))
    elif path.suffix == '.pdf':
        with pymupdf.open(path) as document:
            inspect(json.dumps(document.metadata), str(relative))
            for page in document:
                inspect(page.get_text() + json.dumps(page.get_links(), default=str), str(relative))
    elif path.suffix in {'.md', '.json', '.js', '.mjs', '.py', '.sh', '.css', '.html', '.sql', '.yml', '.yaml', '.txt'} or path.name in {'LICENSE', '.gitignore', '.gitattributes'}:
        text = path.read_text(encoding='utf-8-sig')
        inspect(text, str(relative))
        if path.suffix == '.md':
            for link in re.findall(r'\[[^\]]*\]\(([^)\s]+)\)', text):
                if re.match(r'^[a-z]+:', link, re.I) or link.startswith('#'):
                    continue
                destination = path.parent / unquote(link.split('#')[0])
                if not destination.exists():
                    failures.append(f'{relative}: broken local link {link}')

deck = json.loads((ROOT / 'deck.json').read_text(encoding='utf-8-sig'))
presentation = Presentation(ROOT / 'presentation/Singularity_AI_2027.pptx')
with pymupdf.open(ROOT / 'presentation/Singularity_AI_2027.pdf') as pdf:
    assert len(pdf) == len(presentation.slides) == len(deck) + 2 == 17
    for i, item in enumerate(deck):
        assert item['script'] in presentation.slides[i].notes_slide.notes_text_frame.text, ('stale notes', i + 1)
        assert len(pdf[i].get_text().strip()) > 30
    for i in (15, 16):
        assert 'WORKED EXAMPLE' in pdf[i].get_text()
        assert all(year in pdf[i].get_text() for year in ('2025', '2026', '2027'))
    assert any(link.get('uri') for link in pdf[9].get_links())
    assert all('https://' in pdf[i].get_text() for i in (12, 13, 14))
assert not failures, '\n'.join(failures)
print(f'PASS: {len(files)} tracked files; local links, private-path patterns, binary metadata/links and 17-page exports checked.')
