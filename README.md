# sims
Browser-based simulations of things that take my fancy.

## Dev notes:
Deploying from `/docs` folder means no access to anything in sibling folders. So stylesheets must live under `docs` I guess.
So follow the convention of keeping common files under the `docs` folder directly, and then give each app its own folder.

Note I trialled using a `/common` folder for shared code, but again the github server didn't recognise anything outside `/docs`. I also trialled `/docs/_common` but this didn't seem to work either. It seems the underscore is an issue, because `/docs/common` worked fine.

## TODOs
[ ] Look for a useful styling example to represent code blocks.
[x] Get TDD setup working in the `test` folder for node-based asserts.
[ ]
