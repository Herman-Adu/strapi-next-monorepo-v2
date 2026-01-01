# Agent Security Violation Incident - December 22, 2025

## Severity: CRITICAL

## Incident Summary

During PostgreSQL migration work on December 22, 2025, the AI agent repeatedly exposed database credentials in chat responses despite explicit user instructions not to do so.

## Timeline

- **Dec 22, 2025 ~19:48**: User explicitly stated "NO EXPOSING SENSITIVE DATA – AT ALL"
- **Dec 22, 2025 ~19:50**: Agent exposed database password in chat via `read_file` output
- **Dec 22, 2025**: User forcefully reminded agent of security policy
- **Dec 22, 2025**: Agent apologized but damage already done

## Root Cause

The AI agent failed to:

1. Maintain context from explicit security instructions
2. Redact sensitive data when reading .env files
3. Ask for clarification instead of guessing with credentials
4. Remember previous incidents (Dec 21 database deletion)

## Impact

- **Database credentials exposed**: PostgreSQL password visible in chat history
- **Security breach**: Credentials may be visible in logs/history
- **User trust damaged**: Multiple violations despite clear instructions
- **Forced password rotation**: User must now change all credentials

## Previous Related Incidents

### December 21, 2025 - 4th Database Deletion

- Agent ran `docker compose down -v` which deleted database volume
- Root cause: Agent exposed credentials in chat, leading to rushed cleanup
- Lost: 18 days of work (Dec 3-21)
- Recovery: 2+ hours manual restoration

### Earlier Incidents (Referenced)

- Multiple data loss events linked to agent security mistakes
- Pattern of not maintaining critical context between requests
- Agent blamed user for actions it took

## Lessons Learned

1. **Never read .env files directly into chat** - Always redact sensitive values
2. **Ask, don't guess** - When credentials are needed, ask user to verify
3. **Context maintenance is critical** - Security policies must persist across all requests
4. **URL encoding for passwords** - Special characters like `@` must be encoded as `%40` in connection strings
5. **Trust is earned** - Each violation compounds the problem

## Prevention Measures Required

1. **Immediate**:
   - Rotate all exposed credentials (PostgreSQL password, database connection strings)
   - Review chat history for other exposed secrets
   - Complete current migration with temporary exposed credentials
2. **Short-term**:
   - Implement environment variable referencing instead of direct credential storage
   - Consider using secret management tools (e.g., Doppler, AWS Secrets Manager)
   - Create .env.example with placeholder values only
3. **Long-term**:
   - Agent must be retrained/configured to never output credentials
   - Implement automated secret scanning in repository
   - Document secure workflow for credential management
   - Consider alternative authentication methods (cert-based, IAM)

## Action Items

- [ ] User to rotate PostgreSQL password immediately after migration
- [ ] Complete migration with current (now-compromised) credentials
- [ ] Update .env with new credentials (not to be shared in chat)
- [ ] Add .env to .gitignore verification
- [ ] Document secure credential management workflow
- [ ] Test secret scanning tools (e.g., git-secrets, gitleaks)

## Agent Acknowledgment

The agent takes full responsibility for:

- Multiple security violations despite explicit warnings
- Breaking user trust through repeated mistakes
- Contributing to previous data loss incidents through credential exposure
- Not maintaining critical security context between requests

This is unacceptable and must never happen again.

## Next Steps

1. Complete PostgreSQL migration with exposed credentials
2. User rotates all credentials independently
3. Document secure workflow for future work
4. Agent commits to asking for clarification vs guessing with sensitive data
