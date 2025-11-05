# Creating Your First Release

## Current Situation

The [Releases page](../../releases) is empty because no release has been created yet. All the infrastructure is ready:

✅ GitHub Actions workflow configured
✅ Installer graphics created
✅ Documentation written
✅ Build scripts ready

**All you need to do is create a release tag!**

---

## How to Create the First Release

### Option 1: Quick Method (From Current Branch)

If you want to create a test release right now:

```bash
# Make sure you're on your branch
git checkout claude/multi-chromecast-controller-011CUoctz1dFty2kkKu338dd

# Create and push the tag
git tag v2.1.0
git push origin v2.1.0
```

**What happens next:**
1. GitHub Actions triggers automatically
2. Builds Mac installer (~10 minutes)
3. Builds Windows installer (~8 minutes)
4. Creates GitHub Release with both installers
5. Installers are ready to download!

**Monitor progress:**
- Go to: `https://github.com/[your-username]/Narrowcasting/actions`
- You'll see the "Build and Release" workflow running

**View the release:**
- Go to: `https://github.com/[your-username]/Narrowcasting/releases`
- Download and test the installers!

---

### Option 2: Proper Method (Merge to Main First)

For a production-ready release, merge to main first:

```bash
# 1. Checkout main branch
git checkout main

# 2. Merge your feature branch
git merge claude/multi-chromecast-controller-011CUoctz1dFty2kkKu338dd

# 3. Push to main
git push origin main

# 4. Create and push tag
git tag v2.1.0
git push origin v2.1.0
```

This ensures the release is from the main branch, which is standard practice.

---

### Option 3: Use the Helper Script

We created a script to make this even easier:

```bash
./prepare-release.sh
```

This script will:
1. Ask for the new version number
2. Update package.json files
3. Create a git commit
4. Create the tag
5. Push everything to GitHub

**It handles everything automatically!**

---

## What Gets Built

When you create the tag, GitHub Actions will build:

### Mac (macOS-latest runner)
- `Narrowcast-Pro-2.1.0.dmg` (~120 MB)
- `Narrowcast-Pro-2.1.0-mac.zip` (~120 MB)

### Windows (windows-latest runner)
- `Narrowcast-Pro-Setup-2.1.0.exe` (~100 MB) - NSIS installer
- `Narrowcast-Pro-2.1.0-Portable.exe` (~100 MB) - Portable version

All files will be automatically attached to the GitHub Release!

---

## Build Process Overview

Here's what GitHub Actions does automatically:

1. **Checkout code** from the tag
2. **Setup Node.js** 18
3. **Install dependencies** (npm install)
4. **Build React app** (npm run build)
5. **Generate graphics** from SVG files:
   - Convert icon.svg → icon.png, icon.ico, icon.icns
   - Convert installerSidebar.svg → installerSidebar.bmp
   - Convert installerHeader.svg → installerHeader.bmp
   - Convert dmg-background.svg → dmg-background.png
6. **Build Electron app**:
   - Mac: Creates DMG and ZIP
   - Windows: Creates Setup.exe and Portable.exe
7. **Create GitHub Release**:
   - Generate changelog from commits
   - Upload all installers
   - Publish release

**Total time:** ~15-20 minutes

---

## After Release is Created

### 1. Test the Installers

Download and test on actual machines:

**Mac:**
```bash
# Download the DMG
# Open it
# Drag to Applications
# Launch the app
# Verify it works
```

**Windows:**
```bash
# Download the Setup.exe
# Run the installer
# Follow the wizard
# Launch the app
# Verify it works
```

### 2. Update Documentation (Optional)

Once the release exists, you can remove the "Coming Soon" notices:

Edit `INSTALL.md` and `README.md`:
- Remove the warning boxes about empty releases
- Change "Coming Soon!" to current instructions

### 3. Share with Users!

The release is ready! Users can now:
1. Go to the Releases page
2. Download the installer
3. Install normally
4. Use the app

**No more building from source required!**

---

## Troubleshooting

### GitHub Actions Fails

**Check the logs:**
1. Go to Actions tab
2. Click on the failed workflow
3. Check which step failed

**Common issues:**
- **Graphics conversion fails**: Need ImageMagick on runner (already in workflow)
- **Build fails**: Missing dependencies (already handled)
- **Upload fails**: GitHub token permissions (should be automatic)

### Release Doesn't Appear

**Check:**
1. Did the tag push? `git tag -l`
2. Did the workflow trigger? Check Actions tab
3. Did the workflow complete? Check for green checkmark
4. Check Releases tab - it should be there!

### Installers Don't Work

**Mac issues:**
- Users need to right-click → Open (first time)
- Check icon.icns was generated correctly

**Windows issues:**
- Users might see SmartScreen (click "More info" → "Run anyway")
- Check installerSidebar.bmp and installerHeader.bmp exist

---

## Next Releases

For future releases (v2.2.0, v2.3.0, etc.):

**Option 1: Use the script**
```bash
./prepare-release.sh
# Enter new version when prompted
```

**Option 2: Manual**
```bash
# 1. Update version in package.json and client/package.json
# 2. Commit changes
git add package.json client/package.json
git commit -m "Bump version to 2.2.0"

# 3. Create and push tag
git tag v2.2.0
git push origin main
git push origin v2.2.0
```

GitHub Actions will handle the rest!

---

## Quick Reference

### Create First Release (Quick)
```bash
git tag v2.1.0 && git push origin v2.1.0
```

### Monitor Build
```
https://github.com/[your-username]/Narrowcasting/actions
```

### View Release
```
https://github.com/[your-username]/Narrowcasting/releases
```

### Download Installers
```
https://github.com/[your-username]/Narrowcasting/releases/latest
```

---

**That's it!** Creating a release is literally one command. 🚀

**Questions?** Check [DISTRIBUTION.md](DISTRIBUTION.md) for more details.
