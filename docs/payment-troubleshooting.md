# Payment WebView Troubleshooting Guide

## DNS Resolution Error: `net::ERR_NAME_NOT_RESOLVED`

### Problem

The error occurs when the WebView cannot resolve the domain name in the payment URL, specifically:

- Domain: `developgenderhealth.io.vn`
- Error Code: -2
- Error Description: `net::ERR_NAME_NOT_RESOLVED`

### Root Causes

1. **Domain doesn't exist**: The domain `developgenderhealth.io.vn` may not be registered or configured
2. **DNS misconfiguration**: DNS records not properly set up
3. **Network connectivity**: Local network or DNS server issues
4. **Development environment**: Using a development domain that's not publicly accessible

### Solutions

#### 1. Verify Domain Accessibility

Test the domain manually:

```bash
# Check if domain resolves
nslookup developgenderhealth.io.vn

# Test with curl
curl -I https://developgenderhealth.io.vn

# Test with ping
ping developgenderhealth.io.vn
```

#### 2. Backend Configuration Check

Verify the payment API configuration:

- Check if the correct domain is being returned
- Ensure the payment service is configured for the right environment
- Verify VNPay return URL configuration

#### 3. Environment-Specific Solutions

**Development Environment:**

- Use localhost or IP address instead of domain
- Configure local DNS or hosts file
- Use ngrok or similar tunneling service

**Production Environment:**

- Ensure domain is properly registered and configured
- Check DNS propagation
- Verify SSL certificate

#### 4. WebView Configuration

Enhanced WebView settings for better error handling:

```typescript
<WebView
  source={{ uri: paymentUrl }}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  mixedContentMode="compatibility"
  allowsInlineMediaPlayback={true}
  // Enhanced error handling
  onError={(syntheticEvent) => {
    console.error("WebView Error:", syntheticEvent.nativeEvent);
  }}
/>
```

### Prevention

1. **Use environment variables** for different domains
2. **Implement fallback URLs** for payment services
3. **Add URL validation** before loading WebView
4. **Monitor domain accessibility** in production

### Current Implementation

The updated WebView component now includes:

- ✅ Pre-loading domain validation
- ✅ Enhanced error messages
- ✅ Retry mechanisms
- ✅ Fallback user interface
- ✅ Comprehensive logging

### Next Steps

1. Contact backend team to verify payment URL generation
2. Check VNPay configuration for correct return URLs
3. Consider using IP address temporarily if domain issues persist
4. Implement health check for payment service endpoints
