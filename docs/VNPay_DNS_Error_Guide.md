# VNPay Payment Integration - DNS Error Resolution Guide

## Problem

The error `net::ERR_NAME_NOT_RESOLVED` occurs when trying to access `sandbox.vnpayment.vn`, even though the domain is accessible via ping.

## Root Cause

This is likely due to:

1. DNS server configuration issues
2. Network restrictions
3. Corporate firewall blocking certain domains
4. DNS cache issues

## Solutions Implemented

### 1. Mock Payment System

- Automatically switches to mock payment interface when DNS errors occur
- Allows testing of payment flow without actual VNPay connection
- Simulates both success and failure scenarios

### 2. Enhanced Error Handling

- Detects DNS resolution errors specifically
- Provides user-friendly error messages
- Offers multiple recovery options

### 3. Retry Mechanisms

- Multiple retry attempts with increasing count
- IP address fallback option (though may have CORS issues)
- Clear user feedback on retry attempts

## Usage

### When DNS Error Occurs:

1. **Use Mock Payment**: Test the payment flow with simulated responses
2. **Retry with IP Address**: Attempt to bypass DNS by using direct IP
3. **Try Again**: Standard retry mechanism
4. **Cancel**: Return to previous screen

### For Production:

- Ensure proper DNS configuration
- Consider using a different payment gateway if issues persist
- Implement proper error reporting to monitor DNS issues

## Technical Details

### Domain Information:

- Domain: `sandbox.vnpayment.vn`
- IP Address: `103.220.84.130`
- Status: Pingable but DNS resolution may fail

### Error Codes:

- `-2`: `net::ERR_NAME_NOT_RESOLVED`
- Usually indicates DNS resolution failure

### Mock Payment Features:

- Success/failure simulation
- Processing animation
- Full navigation flow
- URL details display

## Testing

1. Test with problematic domains (like `developgenderhealth.io.vn`)
2. Test with VNPay sandbox domains
3. Test mock payment flows
4. Test retry mechanisms
5. Test IP address fallback

## Monitoring

Check logs for:

- `🌐 [VnpayWebview] DNS resolution error detected`
- `🎭 [VnpayWebview] Using mock payment interface`
- `💥 [VnpayWebview] Render error`
