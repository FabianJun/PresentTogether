# Singularity deployment templates for your agent

These scripts are one hosting option for the example. The agent performs deployment; the teacher does not run these commands. A different activity may use managed or static hosting instead. [General hosting choices](../docs/HOSTING.md)

The scripts target a dedicated fresh x86-64 Debian/Ubuntu VM. They do not create cloud resources, configure DNS or change cloud firewall rules. Review the [hosting estimate](../docs/HOSTING.md) and obtain the user's specific deployment approval first. No cloud resources were created to publish this repository.

`bootstrap-vm.sh HOSTNAME` installs Node 24, Caddy and the application. It uses a dedicated system account, local-only app port, persistent SQLite and systemd restart limits. An existing installation or Caddy configuration causes it to stop rather than overwrite another service.

`backup-vm.sh` takes a consistent SQLite snapshot, checks its integrity, and archives the application plus deployment configuration with SHA-256 checksums. Run it before an update or shutdown, then download the archive. It contains private session state.

## Recovery procedure

Have the agent perform and verify recovery in a dedicated test installation before relying on a backup:

1. Check the outer archive hash against the recorded value. Inspect its entries for absolute paths, parent traversal or unexpected links before extracting into a new private temporary folder.
2. Check `SHA256SUMS` inside and run `PRAGMA integrity_check` on the saved SQLite file. Inspect the application archive's entries too.
3. Prepare the same Node major version and service layout on the intended VM. Keep the existing app and database as a rollback copy. Stop only the `singularity` service before replacing its database; preserve any WAL state in the rollback backup.
4. Restore the verified app and database. Set ownership to the service user for the database and root for code; keep database permissions private. Use the new hostname in the service environment and proxy, rather than blindly restoring the old hostname.
5. Restart, check `/health`, open the moderator and speaker views, and test a separate room. A new hostname means old browser storage will not carry across; use privately saved access links with the new origin, or create a new session.

This public package includes reproducible local/browser tests, not a newly deployed cloud VM or an end-to-end test of these deployment templates on every Linux image. An agent should inspect the target distribution and validate the deployed service rather than assume portability.

## Updates and switching activities

The bootstrap is deliberately not an updater. Save a private backup and Git revision, prepare a new release separately, build and test it, stop the service briefly, then switch the code and compatible database. Keep rollback files until verification passes. Never replace software while a class is voting. A different activity should use a fresh database unless its schema and rules are explicitly compatible.
