# Aman MD

This is the repaired Aman MD WhatsApp bot.

## Run

1. Open the bot folder and install dependencies:

   ```bash
   cd aman-md
   pnpm install
   ```

2. Create a local environment file from `.env.example` and fill in the values you want to use. Do not commit `.env`.

3. Start the bot:

   ```bash
   pnpm start
   ```

MongoDB is optional. If `MONGODB_URL` is configured, the bot connects in the background; a database outage does not block WhatsApp startup or reconnects.

## Repaired behavior

- Owner, master, and sudo checks now await their asynchronous checks correctly.
- Group participants using WhatsApp LIDs are resolved through group metadata before owner/master/sudo matching.
- Number matching is exact instead of using partial `includes` matches.
- Reconnects use guarded exponential backoff and continue after transient disconnects instead of stopping permanently after a fixed attempt count.
- Old sockets and reconnect timers are cleaned up before replacing a session.
- Existing sessions skip archived logout backups during startup.
- Pairing, message handlers, startup scans, and process-level async failures now log useful errors instead of silently disappearing.
- Sudo removal reports whether a user was actually removed.