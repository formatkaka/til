---
title: "Managing Multiple Git Users on One Laptop"
date: "2025-01-18"
tags: ["git", "ssh"]
category: "git"
---

## The Problem

You have multiple GitHub accounts (e.g., work and personal) on the same laptop. Commits keep getting attributed to the wrong user, or you can't push because of permission errors.

## Solution: Conditional Git Config + SSH Keys

### Step 1: Set Up Directory-Based Git Config

In your global `~/.gitconfig`, use `includeIf` to load different configs based on directory:

```ini
# ~/.gitconfig (global)
[user]
    name = work-username
    email = work@company.com
    signingkey = ~/.ssh/[ssh-key].pub

[includeIf "gitdir:~/Work/personal/"]
    path = ~/.gitconfig-personal

[commit]
    gpgsign = true

[gpg]
    format = ssh
```

Create the personal config file:

```ini
# ~/.gitconfig-personal
[user]
    name = personal-username
    email = personal@gmail.com
    signingkey = ~/.ssh/id_rsa_personal.pub
```

Now any repo under `~/Work/personal/` will automatically use your personal identity.

### Step 2: Generate Separate SSH Keys

```bash
# Work key (if not exists)
ssh-keygen -t ed25519 -C "work@company.com" -f ~/.ssh/id_ed25519_work

# Personal key
ssh-keygen -t rsa -C "personal@gmail.com" -f ~/.ssh/id_rsa_personal
```

Add the public keys to their respective GitHub accounts under **Settings → SSH Keys**.

### Step 3: Configure SSH to Use Different Keys

Create/edit `~/.ssh/config`:

```
# Default (work)
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
  IdentitiesOnly yes

# Personal GitHub
Host github.com-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa_personal
  IdentitiesOnly yes
```

### Step 4: Use the Right Remote URL

For personal repos, use the custom host alias:

```bash
# Clone with personal account
git clone git@github.com-personal:username/repo.git

# Or update existing repo
git remote set-url origin git@github.com-personal:username/repo.git
```

## Verification

```bash
# Check which user is configured in current repo
git config user.name
git config user.email

# Test SSH connection
ssh -T git@github.com           # Should show work username
ssh -T git@github.com-personal  # Should show personal username

# Make a test commit
git commit --allow-empty -m "test"
git log -1 --format="%an <%ae>"
```

## Common Gotchas

1. **HTTPS vs SSH**: `includeIf` only changes git config (name/email), not credentials. HTTPS uses system keychain which doesn't know about directories. **Always use SSH for multi-account setups.**

2. **Trailing slash matters**: `gitdir:~/Work/personal/` needs the trailing slash.

3. **Existing commits**: Old commits keep their original author. To rewrite history:
   ```bash
   git filter-branch --env-filter '
   if [ "$GIT_AUTHOR_EMAIL" = "old@email.com" ]; then
       export GIT_AUTHOR_NAME="new-name"
       export GIT_AUTHOR_EMAIL="new@email.com"
   fi' -- --all
   ```

4. **Add key to ssh-agent**: If SSH still fails:
   ```bash
   ssh-add ~/.ssh/id_rsa_personal
   ```

