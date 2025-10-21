/**
 * TypeScript interfaces for API response data structures
 * Ensures type safety and data validation in tests
 */

// Base interface for common properties
export interface BaseEntity {
  id: number;
}

// Comment entity structure for /posts/:postId/comments
export interface Comment extends BaseEntity {
  postId: number;
  name: string;
  email: string;
  body: string;
}

// Photo entity structure for /albums/:albumId/photos  
export interface Photo extends BaseEntity {
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

// Album entity structure for /users/:userId/albums
export interface Album extends BaseEntity {
  userId: number;
  title: string;
}

// Todo entity structure for /users/:userId/todos
export interface Todo extends BaseEntity {
  userId: number;
  title: string;
  completed: boolean;
}

// Post entity structure for /users/:userId/posts
export interface Post extends BaseEntity {
  userId: number;
  title: string;
  body: string;
}

// API Error response structure
export interface ApiError {
  error: string;
  message?: string;
  timestamp?: string;
  [key: string]: unknown;
}

// Health check response structure
export interface HealthResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime?: number;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  status: number;
  headers: Record<string, string>;
}

// Union types for all possible response data
export type ApiResponseData = Comment[] | Photo[] | Album[] | Todo[] | Post[] | HealthResponse;

// Type guards for runtime type checking
export function isComment(obj: unknown): obj is Comment {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as Comment).id === "number" &&
    typeof (obj as Comment).postId === "number" &&
    typeof (obj as Comment).name === "string" &&
    typeof (obj as Comment).email === "string" &&
    typeof (obj as Comment).body === "string"
  );
}

export function isPhoto(obj: unknown): obj is Photo {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as Photo).id === "number" &&
    typeof (obj as Photo).albumId === "number" &&
    typeof (obj as Photo).title === "string" &&
    typeof (obj as Photo).url === "string" &&
    typeof (obj as Photo).thumbnailUrl === "string"
  );
}

export function isAlbum(obj: unknown): obj is Album {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as Album).id === "number" &&
    typeof (obj as Album).userId === "number" &&
    typeof (obj as Album).title === "string"
  );
}

export function isTodo(obj: unknown): obj is Todo {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as Todo).id === "number" &&
    typeof (obj as Todo).userId === "number" &&
    typeof (obj as Todo).title === "string" &&
    typeof (obj as Todo).completed === "boolean"
  );
}

export function isPost(obj: unknown): obj is Post {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as Post).id === "number" &&
    typeof (obj as Post).userId === "number" &&
    typeof (obj as Post).title === "string" &&
    typeof (obj as Post).body === "string"
  );
}

export function isHealthResponse(obj: unknown): obj is HealthResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as HealthResponse).status === "string" &&
    ["healthy", "unhealthy"].includes((obj as HealthResponse).status) &&
    typeof (obj as HealthResponse).timestamp === "string"
  );
}