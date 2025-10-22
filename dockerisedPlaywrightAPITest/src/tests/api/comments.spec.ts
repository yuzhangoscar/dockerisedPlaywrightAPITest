import { test, expect } from "@playwright/test";
import { ApiClient } from "../../utils/api-client";
import { ResponseValidator } from "../../utils/validators";
import { Comment } from "../../types/api-responses";

/**
 * Test suite for /posts/1/comments endpoint
 * Validates comment data structure, status codes, and response integrity
 */
test.describe("Posts Comments API", () => {
  let apiClient: ApiClient;
  const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";
  const testEndpoint = "/posts/1/comments";

  test.beforeEach(async ({ request }) => {
    // Initialize API client with Playwright request context
    apiClient = new ApiClient(request, baseUrl);
    
    // Log test start
    console.log(`[Test Start] Testing endpoint: ${testEndpoint}`);
  });

  test("should return 200 status code for valid post comments request", async () => {
    // Send GET request to comments endpoint
    const response = await apiClient.get<Comment[]>(testEndpoint, {
      expectedStatus: 200,
      timeout: 10000
    });

    // Validate response structure
    ResponseValidator.validateApiResponse(response, 200);
    
    // Log success
    console.log("[Test Success] Comments endpoint returned 200 status");
  });

  test("should return array of comment objects with correct structure", async () => {
    // Get comments data
    const response = await apiClient.get<Comment[]>(testEndpoint);
    
    // Validate it's an array
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data!.length).toBeGreaterThan(0);

    // Validate array contains comment objects
    const isValid = ResponseValidator.validateArrayResponse(
      response,
      ResponseValidator.validateCommentObject
    );
    
    expect(isValid).toBe(true);
    
    console.log(`[Test Success] Validated ${response.data!.length} comment objects`);
  });

  test("should return comments with valid email formats", async () => {
    // Get comments data
    const response = await apiClient.get<Comment[]>(testEndpoint);
    
    expect(response.data).toBeDefined();
    
    // Validate each comment has valid email format
    for (const comment of response.data!) {
      const isValidEmail = ResponseValidator.validateEmailFormat(comment.email);
      expect(isValidEmail).toBe(true);
      
      console.log(`[Email Validation] Comment ID ${comment.id}: ${comment.email} ✓`);
    }
    
    console.log("[Test Success] All comment emails have valid format");
  });

  test("should return comments with non-empty body text", async () => {
    // Get comments data  
    const response = await apiClient.get<Comment[]>(testEndpoint);
    
    expect(response.data).toBeDefined();
    
    // Validate each comment has non-empty body
    for (const comment of response.data!) {
      expect(comment.body).toBeDefined();
      expect(comment.body.trim().length).toBeGreaterThan(0);
      
      console.log(`[Body Validation] Comment ID ${comment.id}: body length ${comment.body.length} ✓`);
    }
    
    console.log("[Test Success] All comments have non-empty body text");
  });

  test("should return comments with correct postId consistency", async () => {
    // Get comments data
    const response = await apiClient.get<Comment[]>(testEndpoint);
    
    expect(response.data).toBeDefined();
    
    // Validate all comments belong to post ID 1
    for (const comment of response.data!) {
      expect(comment.postId).toBe(1);
      
      console.log(`[PostId Validation] Comment ID ${comment.id}: postId ${comment.postId} ✓`);
    }
    
    console.log("[Test Success] All comments have correct postId consistency");
  });

  test("should complete request within 2 second time limit", async () => {
    // Measure response time
    const responseTime = await apiClient.validateResponseTime(testEndpoint, 2000);
    
    // Additional assertion for test clarity
    expect(responseTime).toBeLessThanOrEqual(2000);
    
    console.log(`[Performance Success] Comments endpoint responded in ${responseTime}ms`);
  });

  test("should handle malformed request gracefully", async () => {
    // Test with invalid post ID
    const invalidEndpoint = "/posts/invalid/comments";
    
    const response = await apiClient.get(invalidEndpoint, {
      expectedStatus: 404
    });
    
    // Should return 404 for invalid post ID
    expect(response.status).toBe(404);
    expect(response.error).toBeDefined();
    expect(response.data).toBeUndefined();
    
    console.log("[Test Success] Invalid post ID handled gracefully with 404");
  });

  test("should return error for non-existent post", async () => {
    // Test with non-existent post ID
    const nonExistentEndpoint = "/posts/999/comments";
    
    const response = await apiClient.get(nonExistentEndpoint, {
      expectedStatus: 404
    });
    
    expect(response.status).toBe(404);
    expect(response.error).toBeDefined();
    expect(response.data).toBeUndefined();
    
    console.log("[Test Success] Non-existent post handled with appropriate error");
  });

  test("should include required comment fields", async () => {
    // Get comments data
    const response = await apiClient.get<Comment[]>(testEndpoint);
    
    expect(response.data).toBeDefined();
    
    // Validate required fields for each comment
    for (const comment of response.data!) {
      // Check all required fields are present
      expect(comment.id).toBeDefined();
      expect(typeof comment.id).toBe("number");
      
      expect(comment.postId).toBeDefined();
      expect(typeof comment.postId).toBe("number");
      
      expect(comment.name).toBeDefined();
      expect(typeof comment.name).toBe("string");
      
      expect(comment.email).toBeDefined();
      expect(typeof comment.email).toBe("string");
      
      expect(comment.body).toBeDefined();
      expect(typeof comment.body).toBe("string");
      
      console.log(`[Field Validation] Comment ID ${comment.id}: all required fields present ✓`);
    }
    
    console.log("[Test Success] All comments contain required fields with correct types");
  });
});