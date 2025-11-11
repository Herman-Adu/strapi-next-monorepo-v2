# Utility Scripts

PowerShell scripts for managing development processes.

## Port Management Scripts

### clear-strapi-connections.ps1

Clears all connections on Strapi's port 1337 (kills the Strapi server and any lingering connections).

**Usage:**

```powershell
# From project root
yarn clear:port

# Or directly
powershell -ExecutionPolicy Bypass -File .\scripts\utils\clear-strapi-connections.ps1
```

**What it does:**

- Shows current connections on port 1337
- Kills all processes using the port
- Verifies the port is cleared
- TIME_WAIT connections will clear automatically (they're harmless)

### kill-port.ps1

Generic script to kill all processes using any specified port.

**Usage:**

```powershell
# From project root (requires port parameter)
yarn kill:port -Port 3000

# Or directly
powershell -ExecutionPolicy Bypass -File .\scripts\utils\kill-port.ps1 -Port 3000
```

**Parameters:**

- `-Port` (required): The port number to clear

## When to Use These Scripts

### Common Scenarios:

1. **"Port already in use" error when starting Strapi:**

   ```powershell
   yarn clear:port
   ```

2. **Multiple orphaned Strapi processes:**

   ```powershell
   yarn clear:port
   ```

3. **Need to clear a different port (e.g., Next.js on 3000):**

   ```powershell
   yarn kill:port -Port 3000
   ```

4. **After registry changes to Strapi still seeing connections:**
   ```powershell
   yarn clear:port
   ```

## Understanding Connection States

- **LISTENING**: Active server process (what you want)
- **ESTABLISHED**: Active connection (normal during use)
- **TIME_WAIT**: Recently closed connection (clears in ~2 minutes, harmless)
- **CLOSE_WAIT**: Connection waiting for application to close (client-side)
- **FIN_WAIT_2**: Connection in closing sequence (clears automatically)

**Note:** TIME_WAIT and FIN_WAIT states are normal TCP behavior and will clear automatically. You only need to kill LISTENING or ESTABLISHED processes.

## Troubleshooting

### "Execution Policy" Error

If you get execution policy errors, the scripts automatically use `-ExecutionPolicy Bypass` when run via yarn commands.

### "Access Denied" Error

Some processes may require administrator privileges. Run PowerShell as Administrator:

```powershell
# Right-click PowerShell → Run as Administrator
cd C:\Users\herma\source\repository\strapi-next-monorepo-v2
yarn clear:port
```

### Port Still Shows Connections

TIME_WAIT connections are normal and will clear in ~2 minutes. They don't block new processes from binding to the port.
