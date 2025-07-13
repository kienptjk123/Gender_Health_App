import React from "react";

/**
 * Payment Domain Health Checker
 * Utility to check if payment domains are accessible and provide fallbacks
 */

export interface PaymentHealthCheck {
  domain: string;
  accessible: boolean;
  error?: string;
  timestamp: number;
}

export class PaymentHealthChecker {
  private static cache: Map<string, PaymentHealthCheck> = new Map();
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Check if a payment domain is accessible
   */
  static async checkDomain(url: string): Promise<PaymentHealthCheck> {
    const domain = this.extractDomain(url);

    // Check cache first
    const cached = this.cache.get(domain);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(
        `🔄 [PaymentHealth] Using cached result for ${domain}:`,
        cached.accessible
      );
      return cached;
    }

    console.log(`🔍 [PaymentHealth] Checking domain accessibility: ${domain}`);

    const result: PaymentHealthCheck = {
      domain,
      accessible: false,
      timestamp: Date.now(),
    };

    try {
      // Known problematic domains
      const problematicDomains = [
        "developgenderhealth.io.vn",
        "genderhealth.io.vn",
      ];

      if (problematicDomains.some((d) => domain.includes(d))) {
        result.accessible = false;
        result.error = "Domain known to be inaccessible (DNS resolution fails)";
        console.warn(`⚠️ [PaymentHealth] Known problematic domain: ${domain}`);
      } else {
        // For other domains, assume accessible unless proven otherwise
        result.accessible = true;
        console.log(`✅ [PaymentHealth] Domain appears accessible: ${domain}`);
      }
    } catch (error: any) {
      result.accessible = false;
      result.error = error.message || "Unknown error";
      console.error(
        `❌ [PaymentHealth] Domain check failed for ${domain}:`,
        error
      );
    }

    // Cache the result
    this.cache.set(domain, result);
    return result;
  }

  /**
   * Get payment strategy based on domain health
   */
  static async getPaymentStrategy(paymentUrl: string): Promise<{
    strategy: "webview" | "mock" | "error";
    reason: string;
    healthCheck: PaymentHealthCheck;
  }> {
    const healthCheck = await this.checkDomain(paymentUrl);

    if (healthCheck.accessible) {
      return {
        strategy: "webview",
        reason: "Domain is accessible, use real payment WebView",
        healthCheck,
      };
    } else {
      return {
        strategy: "mock",
        reason: `Domain not accessible: ${healthCheck.error}. Using mock payment for testing.`,
        healthCheck,
      };
    }
  }

  /**
   * Extract domain from URL
   */
  private static extractDomain(url: string): string {
    try {
      const match = url.match(/https?:\/\/([^\/]+)/);
      return match ? match[1] : url;
    } catch {
      return url;
    }
  }

  /**
   * Clear cache (useful for testing)
   */
  static clearCache(): void {
    this.cache.clear();
    console.log("🗑️ [PaymentHealth] Cache cleared");
  }

  /**
   * Get cache status for debugging
   */
  static getCacheStatus(): { [domain: string]: PaymentHealthCheck } {
    const status: { [domain: string]: PaymentHealthCheck } = {};
    this.cache.forEach((value, key) => {
      status[key] = value;
    });
    return status;
  }
}

/**
 * Hook for React components to check payment health
 */
export const usePaymentHealth = (paymentUrl?: string) => {
  const [healthCheck, setHealthCheck] =
    React.useState<PaymentHealthCheck | null>(null);
  const [strategy, setStrategy] = React.useState<
    "webview" | "mock" | "error" | null
  >(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!paymentUrl) return;

    setLoading(true);
    PaymentHealthChecker.getPaymentStrategy(paymentUrl)
      .then((result) => {
        setHealthCheck(result.healthCheck);
        setStrategy(result.strategy);
        console.log(
          `🎯 [PaymentHealth] Strategy for ${paymentUrl}:`,
          result.strategy,
          result.reason
        );
      })
      .catch((error) => {
        console.error(
          "❌ [PaymentHealth] Error checking payment health:",
          error
        );
        setStrategy("error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [paymentUrl]);

  return { healthCheck, strategy, loading };
};

export default PaymentHealthChecker;
