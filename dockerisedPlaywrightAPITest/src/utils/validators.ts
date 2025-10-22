import { expect } from "@playwright/test";
import { 
  Comment, 
  Photo, 
  Album, 
  Todo, 
  Post,
  isComment,
  isPhoto,
  isAlbum,
  isTodo,
  isPost,
  ApiResponse,
  ApiResponseData
} from "../types/api-responses";

/**
 * Validation utilities for API response testing
 * Provides comprehensive validation methods with detailed logging
 */

export class ResponseValidator {
  
  /**
   * Validate email format using RFC 5322 compliant regex
   */
  static validateEmailFormat(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid) {
      console.error(`[Validation Error] Invalid email format: ${email}`);
    }
    
    return isValid;
  }

  /**
   * Validate URL format (HTTP/HTTPS)
   */
  static validateUrlFormat(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const isValid = urlObj.protocol === "http:" || urlObj.protocol === "https:";
      
      if (!isValid) {
        console.error(`[Validation Error] Invalid URL protocol: ${url}`);
      }
      
      return isValid;
    } catch (error) {
      console.error(`[Validation Error] Malformed URL: ${url}`);
      return false;
    }
  }

  /**
   * Validates email format using regex
   */
  static validateEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid) {
      console.log(`[Validation Error] Invalid email format: ${email}`);
    }
    
    return isValid;
  }

  /**
   * Validates comment object structure and content
   */
  static validateCommentObject(comment: CommentResponse): boolean {
    console.log(`[Validation] Validating comment object: ${JSON.stringify(comment, null, 2)}`);

    // Required fields validation
    if (!comment.postId || !comment.id || !comment.name || !comment.email || !comment.body) {
      console.log("[Validation Error] Missing required fields");
      return false;
    }

    // Type validation
    if (typeof comment.postId !== "number" || 
        typeof comment.id !== "number" || 
        typeof comment.name !== "string" || 
        typeof comment.email !== "string" || 
        typeof comment.body !== "string") {
      console.log("[Validation Error] Invalid field types");
      return false;
    }

    // Email format validation
    if (!ResponseValidator.validateEmailFormat(comment.email)) {
      return false;
    }

    // Content validation
    if (comment.name.trim().length === 0 || 
        comment.email.trim().length === 0 || 
        comment.body.trim().length === 0) {
      console.log("[Validation Error] Empty required fields");
      return false;
    }

    console.log("[Validation Success] Comment object validation passed");
    return true;
  }

  /**
   * Validate photo object structure and data integrity
   */
  static validatePhoto(photo: unknown, expectedAlbumId?: number): boolean {
    console.log(`[Validation] Validating photo object:`, photo);
    
    if (!isPhoto(photo)) {
      console.error("[Validation Error] Object does not match Photo interface");
      return false;
    }

    // URL format validation
    if (!this.validateUrlFormat(photo.url)) {
      return false;
    }

    if (!this.validateUrlFormat(photo.thumbnailUrl)) {
      return false;
    }

    // AlbumId consistency validation
    if (expectedAlbumId !== undefined && photo.albumId !== expectedAlbumId) {
      console.error(`[Validation Error] Photo albumId mismatch. Expected: ${expectedAlbumId}, Got: ${photo.albumId}`);
      return false;
    }

    console.log(`[Validation Success] Photo ID ${photo.id} passed all validations`);
    return true;
  }

  /**
   * Validate album object structure and data integrity
   */
  static validateAlbum(album: unknown, expectedUserId?: number): boolean {
    console.log(`[Validation] Validating album object:`, album);
    
    if (!isAlbum(album)) {
      console.error("[Validation Error] Object does not match Album interface");
      return false;
    }

    // UserId consistency validation
    if (expectedUserId !== undefined && album.userId !== expectedUserId) {
      console.error(`[Validation Error] Album userId mismatch. Expected: ${expectedUserId}, Got: ${album.userId}`);
      return false;
    }

    // Non-empty title validation
    if (!album.title || album.title.trim().length === 0) {
      console.error(`[Validation Error] Album title is empty for album ID: ${album.id}`);
      return false;
    }

    console.log(`[Validation Success] Album ID ${album.id} passed all validations`);
    return true;
  }

  /**
   * Validate todo object structure and data integrity
   */
  static validateTodo(todo: unknown, expectedUserId?: number): boolean {
    console.log(`[Validation] Validating todo object:`, todo);
    
    if (!isTodo(todo)) {
      console.error("[Validation Error] Object does not match Todo interface");
      return false;
    }

    // Boolean type validation for completed field
    if (typeof todo.completed !== "boolean") {
      console.error(`[Validation Error] Todo completed field is not boolean: ${typeof todo.completed}`);
      return false;
    }

    // UserId consistency validation
    if (expectedUserId !== undefined && todo.userId !== expectedUserId) {
      console.error(`[Validation Error] Todo userId mismatch. Expected: ${expectedUserId}, Got: ${todo.userId}`);
      return false;
    }

    // Non-empty title validation
    if (!todo.title || todo.title.trim().length === 0) {
      console.error(`[Validation Error] Todo title is empty for todo ID: ${todo.id}`);
      return false;
    }

    console.log(`[Validation Success] Todo ID ${todo.id} passed all validations`);
    return true;
  }

  /**
   * Validate post object structure and data integrity
   */
  static validatePost(post: unknown, expectedUserId?: number): boolean {
    console.log(`[Validation] Validating post object:`, post);
    
    if (!isPost(post)) {
      console.error("[Validation Error] Object does not match Post interface");
      return false;
    }

    // UserId consistency validation
    if (expectedUserId !== undefined && post.userId !== expectedUserId) {
      console.error(`[Validation Error] Post userId mismatch. Expected: ${expectedUserId}, Got: ${post.userId}`);
      return false;
    }

    // Non-empty title and body validation
    if (!post.title || post.title.trim().length === 0) {
      console.error(`[Validation Error] Post title is empty for post ID: ${post.id}`);
      return false;
    }

    if (!post.body || post.body.trim().length === 0) {
      console.error(`[Validation Error] Post body is empty for post ID: ${post.id}`);
      return false;
    }

    console.log(`[Validation Success] Post ID ${post.id} passed all validations`);
    return true;
  }

  /**
   * Validate array response structure and individual items
   */
  static validateArrayResponse<T>(
    response: ApiResponse<T[]>,
    validator: (item: unknown, ...args: unknown[]) => boolean,
    ...validatorArgs: unknown[]
  ): boolean {
    if (!response.data || !Array.isArray(response.data)) {
      console.error("[Validation Error] Response data is not an array");
      return false;
    }

    if (response.data.length === 0) {
      console.warn("[Validation Warning] Response array is empty");
      return true; // Empty arrays are valid
    }

    console.log(`[Validation] Validating array of ${response.data.length} items`);
    
    for (let i = 0; i < response.data.length; i++) {
      const item = response.data[i];
      if (!validator(item, ...validatorArgs)) {
        console.error(`[Validation Error] Item at index ${i} failed validation:`, item);
        return false;
      }
    }

    console.log(`[Validation Success] All ${response.data.length} items passed validation`);
    return true;
  }

  /**
   * Assert response time is within acceptable limits
   */
  static assertResponseTime(actualTime: number, maxTime: number = 2000): void {
    console.log(`[Performance] Response time: ${actualTime}ms (limit: ${maxTime}ms)`);
    
    expect(actualTime).toBeLessThanOrEqual(maxTime);
    
    if (actualTime <= maxTime) {
      console.log(`[Performance Success] Response time within acceptable limits`);
    }
  }

  /**
   * Comprehensive API response validation
   */
  static validateApiResponse<T extends ApiResponseData>(
    response: ApiResponse<T>,
    expectedStatus: number = 200
  ): void {
    console.log(`[Validation] Validating API response with expected status: ${expectedStatus}`);
    
    // Status code validation
    expect(response.status).toBe(expectedStatus);
    
    // Response structure validation
    if (expectedStatus === 200) {
      expect(response.data).toBeDefined();
      expect(response.error).toBeUndefined();
    } else {
      expect(response.error).toBeDefined();
      expect(response.data).toBeUndefined();
    }

    // Headers validation
    expect(response.headers).toBeDefined();
    expect(typeof response.headers).toBe("object");
    
    console.log(`[Validation Success] API response structure validated`);
  }
}