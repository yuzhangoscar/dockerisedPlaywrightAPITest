import { APIRequestContext, expect } from "@playwright/test";
import { ApiResponse, ApiResponseData, ApiError } from "../types/api-responses";

/**
 * API client wrapper using Playwright request context
 * Provides standardized methods for API testing with comprehensive logging
 */
export class ApiClient {
  private readonly request: APIRequestContext;
  private readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string = "") {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Perform GET request with comprehensive error handling and logging
   */
  async get<T extends ApiResponseData>(
    endpoint: string,
    options: { 
      expectedStatus?: number;
      timeout?: number;
      headers?: Record<string, string>;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { expectedStatus = 200, timeout = 10000, headers = {} } = options;
    const url = `${this.baseUrl}${endpoint}`;
    
    // Log request details
    console.log(`[API Request] GET ${url}`);
    console.log(`[API Request] Expected Status: ${expectedStatus}`);
    
    const startTime = Date.now();
    
    try {
      // Execute request with timeout
      const response = await this.request.get(url, {
        headers: {
          "Accept": "application/json",
          ...headers
        },
        timeout
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Log response details
      console.log(`[API Response] Status: ${response.status()}`);
      console.log(`[API Response] Response Time: ${responseTime}ms`);
      
      // Parse response body
      let responseData: T | ApiError;
      try {
        responseData = await response.json() as T | ApiError;
      } catch (parseError) {
        console.error(`[API Error] Failed to parse JSON response: ${parseError}`);
        throw new Error(`Invalid JSON response from ${url}`);
      }

      // Validate response status
      if (response.status() !== expectedStatus) {
        console.error(`[API Error] Unexpected status code: ${response.status()}, expected: ${expectedStatus}`);
        console.error(`[API Error] Response body:`, responseData);
      }

      // Create standardized response object
      // For successful responses (2xx), put data in data field
      // For error responses (4xx, 5xx), put response in error field regardless of expectedStatus
      const isSuccessStatus = response.status() >= 200 && response.status() < 300;
      const apiResponse: ApiResponse<T> = {
        data: isSuccessStatus ? responseData as T : undefined,
        error: !isSuccessStatus ? responseData as ApiError : undefined,
        status: response.status(),
        headers: Object.fromEntries(response.headersArray().map(h => [h.name, h.value]))
      };

      // Log success/failure
      if (response.status() === expectedStatus) {
        console.log(`[API Success] GET ${url} completed successfully`);
      } else {
        console.error(`[API Failure] GET ${url} failed with status ${response.status()}`);
      }

      return apiResponse;

    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.error(`[API Error] Request failed after ${responseTime}ms:`, error);
      console.error(`[API Error] URL: ${url}`);
      
      // Re-throw with additional context
      throw new Error(`API request to ${url} failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Validate response time is within acceptable limits (2 seconds as per constitution)
   */
  async validateResponseTime(
    endpoint: string, 
    maxResponseTime: number = 2000
  ): Promise<number> {
    const startTime = Date.now();
    
    try {
      await this.get(endpoint);
      const responseTime = Date.now() - startTime;
      
      // Assert response time is within limits
      expect(responseTime).toBeLessThanOrEqual(maxResponseTime);
      
      console.log(`[Performance] ${endpoint} responded in ${responseTime}ms (limit: ${maxResponseTime}ms)`);
      return responseTime;
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error(`[Performance] ${endpoint} failed after ${responseTime}ms:`, error);
      throw error;
    }
  }

  /**
   * Execute multiple concurrent requests for load testing
   */
  async concurrentRequests(
    endpoint: string, 
    concurrency: number = 10
  ): Promise<ApiResponse<ApiResponseData>[]> {
    console.log(`[Load Test] Starting ${concurrency} concurrent requests to ${endpoint}`);
    
    const startTime = Date.now();
    
    // Create array of request promises
    const requestPromises = Array.from({ length: concurrency }, (_, index) => {
      console.log(`[Load Test] Initiating request ${index + 1}/${concurrency}`);
      return this.get(endpoint);
    });

    try {
      // Execute all requests concurrently
      const responses = await Promise.all(requestPromises);
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Log load test results
      console.log(`[Load Test] Completed ${concurrency} requests in ${totalTime}ms`);
      console.log(`[Load Test] Average response time: ${totalTime / concurrency}ms`);
      
      // Count successful responses
      const successCount = responses.filter(r => r.status === 200).length;
      console.log(`[Load Test] Success rate: ${successCount}/${concurrency} (${(successCount/concurrency*100).toFixed(1)}%)`);
      
      return responses;
      
    } catch (error) {
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      console.error(`[Load Test] Failed after ${totalTime}ms:`, error);
      throw error;
    }
  }

  /**
   * Health check helper method
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get("/health", { expectedStatus: 200 });
      return response.status === 200;
    } catch (error) {
      console.error("[Health Check] Failed:", error);
      return false;
    }
  }
}