# Chromecast Custom Receiver Setup Guide

## 🎯 Why Do You Need This?

Chromecast's **DefaultMediaReceiver** only supports media files (video, audio, images). It **cannot display HTML presentations**, which is what Narrowcast Pro uses for slides.

To display HTML presentations on Chromecast, you need to register a **custom receiver** with Google Cast. This is:
- ✅ **Free** (no cost)
- ✅ **Quick** (takes 15-30 minutes for first-time setup)
- ✅ **Required** for HTML presentations to work

Without this setup, your presentations will not display on Chromecast devices.

---

## 📋 Prerequisites

Before you start, you'll need:

1. **Google Account** - Any Gmail/Google account works
2. **$5 USD Registration Fee** - One-time payment to Google (required by Google to prevent abuse)
3. **HTTPS URL** - Your receiver must be hosted on HTTPS in production
   - For development: HTTP is OK for testing
   - For production: You need HTTPS (see options below)

---

## 🚀 Step-by-Step Registration

### Step 1: Register as a Cast Developer

1. Go to the [Google Cast SDK Developer Console](https://cast.google.com/publish)
2. Sign in with your Google account
3. Accept the Google Cast SDK Additional Terms of Service
4. **Pay the $5 USD registration fee**
   - This is a one-time payment
   - Required by Google to access the Developer Console
   - Payment is processed by Google

### Step 2: Register Your Receiver Application

1. In the Developer Console, click **"Add New Application"**

2. Select **"Custom Receiver"**

3. Fill in the application details:

   **Application Name**: `Narrowcast Pro Receiver`
   - This name appears in logs and debugging tools

   **Receiver Application URL**: This is where your receiver.html is hosted
   - **Development**: `http://YOUR_SERVER_IP:3001/receiver/receiver.html`
     - Example: `http://192.168.1.100:3001/receiver/receiver.html`
     - Find your IP: Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - **Production**: `https://yourdomain.com/receiver/receiver.html`
     - **MUST be HTTPS** for production
     - See "HTTPS Setup Options" section below

   **Guest Mode**: `Not Supported` (unless you need guest mode)

   **Category**: `Education` or `Business` (whichever fits better)

4. Click **"Save"**

### Step 3: Get Your APP ID

1. After saving, you'll see your new receiver in the list
2. Copy the **Application ID** (looks like: `12345678` or `ABCD1234`)
3. **Save this ID** - you'll need it in the next step

### Step 4: Configure Narrowcast Pro

1. Create a `.env` file in the root of your Narrowcast Pro directory:
   ```bash
   # Copy the example file
   cp .env.example .env
   ```

2. Edit `.env` and add your APP ID:
   ```env
   CHROMECAST_APP_ID=YOUR_APP_ID_HERE
   ```

   Example:
   ```env
   CHROMECAST_APP_ID=12345678
   ```

3. Restart Narrowcast Pro:
   ```bash
   npm run dev
   # or if running production
   npm start
   ```

4. Check the logs - you should see:
   ```
   ✓ Using custom Chromecast receiver with APP_ID: 12345678
   ```

### Step 5: Test Your Receiver

1. **Register your Chromecast for testing** (only needed during development):
   - Go to [Cast Developer Console > Devices](https://cast.google.com/publish/#/devices)
   - Click "Add New Device"
   - Enter your Chromecast's Serial Number (found in Google Home app)
   - Your Chromecast will be ready for testing in ~15 minutes

2. **Test casting a presentation**:
   - Open Narrowcast Pro
   - Create a simple test presentation with 1-2 slides
   - Select your Chromecast device
   - Click "Cast"
   - Your presentation should appear on the TV! 🎉

---

## 🌐 HTTPS Setup Options

For **production use**, your receiver must be hosted on HTTPS. Here are your options:

### Option 1: Host on Your Own Domain ⭐ Recommended

If you have a domain name and web hosting:

1. Upload `receiver.html` to your web server
2. Ensure it's accessible via HTTPS
3. Update your receiver URL in the Cast Console:
   ```
   https://yourdomain.com/narrowcast/receiver.html
   ```

### Option 2: Use Cloudflare Tunnel (Free)

Cloudflare Tunnel provides free HTTPS access to your local server:

1. Install Cloudflare Tunnel: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/
2. Create a tunnel pointing to `localhost:3001`
3. Get your tunnel URL: `https://your-tunnel.trycloudflare.com`
4. Your receiver URL becomes:
   ```
   https://your-tunnel.trycloudflare.com/receiver/receiver.html
   ```

### Option 3: Use ngrok (Free/Paid)

ngrok provides HTTPS tunneling to localhost:

1. Install ngrok: https://ngrok.com/download
2. Start tunnel: `ngrok http 3001`
3. Copy the HTTPS URL: `https://abc123.ngrok.io`
4. Your receiver URL becomes:
   ```
   https://abc123.ngrok.io/receiver/receiver.html
   ```
5. Note: Free ngrok URLs change on restart; paid plans provide static URLs

### Option 4: GitHub Pages (Free, Static Hosting)

Host only the receiver.html on GitHub Pages:

1. Create a new GitHub repository
2. Upload `receiver.html` to the repository
3. Enable GitHub Pages in repository settings
4. Your receiver URL becomes:
   ```
   https://yourusername.github.io/repo-name/receiver.html
   ```
5. Update receiver URL in Cast Console

**Important**: The receiver on GitHub Pages needs to load presentation content from your local server, so you'll need CORS configured correctly.

---

## 🔧 Troubleshooting

### "Chromecast shows logo only, no presentation"

**Cause**: Custom receiver not configured or APP_ID is wrong

**Solutions**:
1. Check that `CHROMECAST_APP_ID` is set in `.env`
2. Verify the APP_ID matches the one in Cast Console
3. Restart Narrowcast Pro after changing `.env`
4. Check logs for "Using custom Chromecast receiver"

### "Receiver failed to load"

**Cause**: Receiver URL is not accessible from Chromecast

**Solutions**:
1. Verify receiver URL in browser: `http://YOUR_IP:3001/receiver/receiver.html`
2. Ensure Chromecast is on the same network as your server
3. Check firewall settings - port 3001 must be accessible
4. For HTTPS: Verify SSL certificate is valid

### "Presentation URL not loading in receiver"

**Cause**: Network issue or wrong SERVER_HOST

**Solutions**:
1. Check that presentation player URL is accessible: `http://YOUR_IP:3001/api/presentations/ID/player`
2. Verify `SERVER_HOST` environment variable if set
3. Check CORS settings in server
4. Check firewall and network configuration

### "Cast button works but nothing appears on TV"

**Cause**: Receiver not registered for your device

**Solutions**:
1. Register your Chromecast's serial number in Cast Console > Devices
2. Wait 15 minutes after registration
3. Reboot your Chromecast
4. Try casting again

### "ERROR: INVALID_APPLICATION_ID"

**Cause**: APP_ID not found or not published

**Solutions**:
1. Double-check your APP_ID in `.env`
2. Ensure receiver is published in Cast Console
3. Wait 15 minutes after publishing
4. For development: Ensure your Chromecast is registered for testing

---

## 🧪 Development vs Production

### Development Mode

- ✅ Can use HTTP (no HTTPS required)
- ✅ Must register each Chromecast device for testing
- ✅ Changes to receiver take effect after ~15 minutes
- ⚠️  Receiver URL must be accessible from Chromecast on network

**Dev Setup**:
```env
CHROMECAST_APP_ID=12345678
NODE_ENV=development
```

**Dev Receiver URL**:
```
http://192.168.1.100:3001/receiver/receiver.html
```

### Production Mode

- 🔒 **MUST use HTTPS**
- ✅ Works on any Chromecast (no registration needed)
- ✅ Changes take effect immediately
- 🌐 Receiver must be publicly accessible

**Prod Setup**:
```env
CHROMECAST_APP_ID=12345678
NODE_ENV=production
```

**Prod Receiver URL**:
```
https://yourdomain.com/receiver/receiver.html
```

---

## 📊 Monitoring and Debugging

### Enable Debug Mode

The receiver has built-in debugging. To enable it:

1. Edit `server/public/receiver.html`
2. Find `DEBUG_MODE` at the top of the script
3. Set it to `true`:
   ```javascript
   const DEBUG_MODE = true;
   ```

Debug info will appear in the bottom-right corner of the Chromecast screen.

### Check Receiver Logs

Chromecast receiver logs can be viewed:

1. While casting, open Chrome browser on your computer
2. Go to: `chrome://inspect/#devices`
3. Find your Chromecast under "Cast devices"
4. Click "inspect" to see console logs

### Check Server Logs

Narrowcast Pro logs all cast operations:

```bash
# View logs
tail -f logs/app.log

# Look for these messages:
[INFO] Using custom Chromecast receiver with APP_ID: 12345678
[INFO] Launching custom receiver for device-id...
[INFO] Custom receiver launched for device-id
[INFO] Sending LOAD_PRESENTATION to device-id
```

---

## 🎓 Understanding the Architecture

Here's how custom receivers work:

```
[Narrowcast Pro Server]
         ↓
    (launches app)
         ↓
    [Chromecast] ← loads receiver.html via APP_ID
         ↓
   (receiver.html running on Chromecast)
         ↓
    receives message: "LOAD_PRESENTATION"
         ↓
    loads presentation URL in iframe
         ↓
   [Presentation displays on TV] 🎉
```

**Key Points**:
- Receiver.html runs **on the Chromecast**, not on your server
- Your server sends **messages** to the receiver telling it what to load
- The receiver then **fetches** the presentation HTML from your server
- Everything must be **network-accessible** from the Chromecast

---

## 📚 Additional Resources

- [Google Cast SDK Documentation](https://developers.google.com/cast)
- [Custom Receiver Reference](https://developers.google.com/cast/docs/custom_receiver)
- [Cast Application Framework (CAF)](https://developers.google.com/cast/docs/caf_receiver)
- [Troubleshooting Guide](https://developers.google.com/cast/docs/debugging)

---

## ❓ FAQ

**Q: Do I need to pay the $5 fee for each application?**
A: No, you pay $5 once per Google account. You can then register multiple receiver applications.

**Q: Can I use DefaultMediaReceiver without registering?**
A: Yes, but it only works for media files (video, audio, images). HTML presentations will NOT work.

**Q: How long does registration take?**
A: Registration is instant, but changes can take 15-30 minutes to propagate to Chromecast devices.

**Q: Can I test without HTTPS?**
A: Yes! During development, you can use HTTP if you register your Chromecast device for testing.

**Q: Do I need to republish when I change receiver.html?**
A: No! The Cast Console stores the URL, not the file. Changes to receiver.html take effect immediately (or after Chromecast cache clears, ~5 minutes).

**Q: What if I don't want to pay $5?**
A: Unfortunately, the $5 fee is required by Google to access the Cast Developer Console. There's no way around it. Consider it a one-time investment for unlimited Chromecast apps.

**Q: Can I use someone else's APP_ID?**
A: No. Each APP_ID is tied to a specific receiver URL that you control. Using someone else's APP_ID won't work unless they're hosting your receiver for you.

---

## 🎉 Success Checklist

Before going live, verify:

- [ ] Custom receiver is registered in Cast Console
- [ ] APP_ID is saved in `.env` file
- [ ] Receiver URL is accessible (test in browser)
- [ ] Receiver URL uses HTTPS (for production)
- [ ] Narrowcast Pro shows "Using custom receiver" in logs
- [ ] Test presentation casts successfully to Chromecast
- [ ] Presentation displays correctly on TV
- [ ] Multiple slides transition properly
- [ ] Stop command works

---

**Need Help?**

If you encounter issues not covered in this guide:
1. Check server logs: `logs/app.log`
2. Check receiver logs: `chrome://inspect/#devices`
3. Review Cast Console for errors
4. Open an issue on GitHub with logs and error messages

Happy Casting! 📺✨
