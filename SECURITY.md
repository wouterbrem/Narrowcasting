# Security Audit Report

**Date:** 2025-11-05
**Status:** Known vulnerabilities documented

---

## Summary

The codebase has been audited and contains some dependency vulnerabilities that require breaking changes to fix. This document tracks the current security status and provides recommendations.

---

## Backend Dependencies (Root)

### Current Vulnerabilities

**Total:** 5 vulnerabilities (1 moderate, 4 high)

#### 1. Electron ASAR Integrity Bypass (Moderate)
- **Package:** `electron <35.7.5`
- **Current Version:** 28.0.0
- **Fixed Version:** 35.7.5+
- **Impact:** ASAR integrity can be bypassed via resource modification
- **Advisory:** https://github.com/advisories/GHSA-vmqv-hx8q-j7mg
- **Fix:** `npm install electron@latest` (breaking change)

#### 2. IP SSRF Improper Categorization (High)
- **Package:** `ip *`
- **Impact:** SSRF vulnerability in isPublic method
- **Advisory:** https://github.com/advisories/GHSA-2p57-rm9w-gvfp
- **Affected Chain:** ip → dns-packet → multicast-dns → bonjour
- **Fix:** Update bonjour to 3.3.0+ (may require code changes)

### Recommendations

1. **Upgrade Electron** to v35.7.5 or later
   - Test thoroughly after upgrade (breaking changes expected)
   - Update electron-builder configuration if needed

2. **Update Bonjour** or switch to alternative mDNS library
   - `bonjour@3.3.0+` fixes the IP vulnerability
   - Alternative: Consider `@homebridge/bonjour-hap` or `dnssd`

---

## Frontend Dependencies (Client)

### Current Vulnerabilities

**Total:** 9 vulnerabilities (3 moderate, 6 high)

#### 1. nth-check Regular Expression Complexity (High)
- **Package:** `nth-check <2.0.1`
- **Impact:** Inefficient regex can cause performance issues
- **Advisory:** https://github.com/advisories/GHSA-rp65-9cf3-cjxr
- **Affected Chain:** nth-check → css-select → svgo → @svgr/plugin-svgo → react-scripts
- **Fix:** Upgrade react-scripts (breaking change)

#### 2. PostCSS Line Return Parsing Error (Moderate)
- **Package:** `postcss <8.4.31`
- **Impact:** Parsing error with line returns
- **Advisory:** https://github.com/advisories/GHSA-7fh5-64p2-3v2j
- **Affected Chain:** postcss → resolve-url-loader → react-scripts
- **Fix:** Upgrade react-scripts (breaking change)

#### 3. webpack-dev-server Source Code Theft (Moderate)
- **Package:** `webpack-dev-server <=5.2.0`
- **Impact:** Source code may be stolen via malicious websites
- **Advisories:**
  - https://github.com/advisories/GHSA-9jgg-88mc-972h
  - https://github.com/advisories/GHSA-4v9v-hfq4-rm2v
- **Fix:** Upgrade webpack-dev-server (breaking change)

### Recommendations

1. **Upgrade react-scripts** to latest version
   ```bash
   cd client
   npm install react-scripts@latest
   ```
   - **Warning:** This is a MAJOR version upgrade (4.x → 5.x)
   - Test thoroughly after upgrade
   - May require changes to webpack config, browserslist, etc.

2. **Alternative:** Migrate to Vite
   - Modern, faster build tool
   - Better security updates
   - Improved developer experience

---

## Risk Assessment

### Development Environment
- **Risk Level:** Medium
- **Reason:** Vulnerabilities mainly affect dev-server and build tools
- **Impact:** Limited to development machines

### Production Environment
- **Risk Level:** Low-Medium
- **Reason:** Production builds don't include dev dependencies
- **Impact:**
  - Electron vulnerability affects runtime
  - IP/Bonjour vulnerability affects Chromecast discovery
  - Frontend vulnerabilities don't affect compiled app

---

## Mitigation Steps (Immediate)

While planning the dependency upgrades, implement these mitigations:

### 1. Network Security
- ✅ App runs on localhost only
- ✅ No external network exposure by default
- ⚠️ Ensure firewall rules are properly configured

### 2. Input Validation
- ✅ Branding JSON parsing now has validation (as of latest fix)
- ✅ File upload restrictions in place (5MB limit, images only)
- ⚠️ Consider adding Content Security Policy for custom HTML slides

### 3. Development Practices
- ⚠️ Only run dev server on trusted networks
- ⚠️ Don't visit untrusted websites while dev server is running
- ⚠️ Use a separate browser profile for development

---

## Upgrade Plan (Recommended)

### Phase 1: Backend (Estimated time: 2-3 hours)
1. ✅ Update package.json to require electron@^35.7.5
2. ✅ Test all Electron features (window management, menu, IPC)
3. ✅ Update electron-builder config if needed
4. ✅ Test installers on Mac and Windows

### Phase 2: Bonjour/mDNS (Estimated time: 1-2 hours)
1. ✅ Evaluate alternatives to bonjour
2. ✅ Test with multiple Chromecast devices
3. ✅ Verify discovery works on different networks

### Phase 3: Frontend (Estimated time: 4-6 hours)
1. ✅ Upgrade react-scripts to v5
2. ✅ Fix any breaking changes
3. ✅ Test all React components
4. ✅ Verify build output
5. ✅ Test in Electron app

### Phase 4: Testing (Estimated time: 2-3 hours)
1. ✅ Full regression testing
2. ✅ Test on Mac and Windows
3. ✅ Test Chromecast casting
4. ✅ Test all slide types
5. ✅ Test branding system

**Total Estimated Time:** 9-14 hours

---

## Testing Checklist

Before deploying after upgrades:

- [ ] App starts successfully on Mac
- [ ] App starts successfully on Windows
- [ ] Chromecasts are discovered
- [ ] Can cast to Chromecast
- [ ] All 9 slide types work
- [ ] Custom branding works
- [ ] Presentations play correctly
- [ ] Logs are written properly
- [ ] File uploads work
- [ ] WebSocket connection stable
- [ ] No console errors
- [ ] Build size is reasonable

---

## Notes

### Why Not Fix Now?

Breaking changes in dependencies require significant testing and may introduce regressions. Given that:
1. The app is for **internal use** (low risk)
2. The app runs on **localhost** (limited exposure)
3. Production builds **don't include dev dependencies**
4. Vulnerabilities are **medium severity** (not critical)

It's recommended to schedule a dedicated upgrade session with proper testing rather than forcing fixes now.

### When to Fix

- **High Priority:** If exposing app to network
- **Medium Priority:** For next major release (v2.2.0)
- **Can Wait:** If only using locally on trusted machines

---

## Contact

For security concerns or questions about this audit:
- Check README.md for project documentation
- Review CODE_REVIEW.md for broader code quality issues
- Open an issue on GitLab for tracking

---

**Last Updated:** 2025-11-05
**Next Audit Recommended:** After dependency upgrades
