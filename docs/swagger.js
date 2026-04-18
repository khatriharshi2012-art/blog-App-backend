const swaggerUi = require("swagger-ui-express");

const serverUrl =
  process.env.API_BASE_URL ||
  `http://localhost:${process.env.PORT || 3000}`;

const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Blog App API",
    version: "1.0.0",
    description:
      "Production-oriented API documentation for the Blog App backend, including authentication, role-protected blog management, and interactive request examples.",
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
  },
  servers: [
    {
      url: serverUrl,
      description: "Current environment",
    },
  ],
  tags: [
    { name: "Auth", description: "User registration, login, and profile APIs" },
    { name: "Blogs", description: "Blog CRUD and engagement APIs" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Paste the JWT access token returned from login/register.",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "67f51b9d77212d8a71234567" },
          name: { type: "string", example: "Aman Sharma" },
          email: { type: "string", format: "email", example: "aman@example.com" },
          role: { type: "string", enum: ["admin", "user"], example: "user" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Comment: {
        type: "object",
        properties: {
          user: { type: "string", example: "67f51b9d77212d8a71234567" },
          text: { type: "string", example: "Really helpful post." },
          _id: { type: "string", example: "67f51c8577212d8a71234568" },
        },
      },
      Blog: {
        type: "object",
        properties: {
          _id: { type: "string", example: "67f51c0777212d8a71234567" },
          title: { type: "string", example: "Scaling an Express API" },
          content: {
            type: "string",
            example: "This article covers validation, auth, and observability.",
          },
          author: { type: "string", example: "67f51b9d77212d8a71234567" },
          likes: {
            type: "array",
            items: { type: "string" },
            example: ["67f51b9d77212d8a71234567"],
          },
          comments: {
            type: "array",
            items: { $ref: "#/components/schemas/Comment" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Aman Sharma" },
          email: { type: "string", format: "email", example: "aman@example.com" },
          password: { type: "string", format: "password", example: "Secret@123" },
          role: { type: "string", enum: ["admin", "user"], example: "user" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "aman@example.com" },
          password: { type: "string", format: "password", example: "Secret@123" },
        },
      },
      CreateBlogRequest: {
        type: "object",
        required: ["title", "content"],
        properties: {
          title: { type: "string", example: "Scaling an Express API" },
          content: {
            type: "string",
            example: "This article covers validation, auth, and observability.",
          },
        },
      },
      BlogIdRequest: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string", example: "67f51c0777212d8a71234567" },
        },
      },
      UpdateBlogRequest: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string", example: "67f51c0777212d8a71234567" },
          title: { type: "string", example: "Updated Express API Guide" },
          content: {
            type: "string",
            example: "Updated content with better examples and deployment notes.",
          },
        },
      },
      CommentBlogRequest: {
        type: "object",
        required: ["id", "text"],
        properties: {
          id: { type: "string", example: "67f51c0777212d8a71234567" },
          text: { type: "string", example: "Thanks for sharing this." },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "boolean", example: false },
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Internal server error" },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: "Missing, invalid, or expired token",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      Forbidden: {
        description: "Authenticated user does not have permission",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Forbidden: You do not have permission",
                },
              },
            },
          },
        },
      },
      ServerError: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
    },
  },
  paths: {
    "/user/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        description: "Creates a user account and returns a JWT token.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: true },
                    message: { type: "string", example: "user created successfully" },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing required fields",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          409: {
            description: "User already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/user/login": {
      post: {
        tags: ["Auth"],
        summary: "Authenticate a user",
        description: "Validates credentials and returns an access token.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: true },
                    message: { type: "string", example: "login successful" },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                        accessToken: {
                          type: "string",
                          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing email or password",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/user/me": {
      get: {
        tags: ["Auth"],
        summary: "Get the current authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Authenticated user profile",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/blog/create-blog": {
      post: {
        tags: ["Blogs"],
        summary: "Create a new blog",
        description: "Admin-only endpoint to create a blog post.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateBlogRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Blog created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: true },
                    message: { type: "string", example: "Blog created successfully" },
                    data: { $ref: "#/components/schemas/Blog" },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing required blog fields",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/blog/get-blog": {
      get: {
        tags: ["Blogs"],
        summary: "List blogs",
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number for pagination.",
          },
          {
            in: "query",
            name: "pageSize",
            schema: { type: "integer", minimum: 1, default: 10 },
            description: "Number of blog items to return.",
          },
        ],
        responses: {
          200: {
            description: "Blogs fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: true },
                    message: { type: "string", example: "blog fetched successfully" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Blog" },
                    },
                  },
                },
              },
            },
          },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/blog/get-blog-id": {
      post: {
        tags: ["Blogs"],
        summary: "Get a single blog by id",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BlogIdRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Blog lookup result",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: true },
                    message: { type: "string", example: "blog Found by id." },
                    data: { $ref: "#/components/schemas/Blog" },
                  },
                },
              },
            },
          },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/blog/update-blog": {
      post: {
        tags: ["Blogs"],
        summary: "Update an existing blog",
        description: "Admin-only endpoint. Supply the blog id and the fields to change.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateBlogRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Blog updated or not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: true },
                    message: { type: "string", example: "Blog updated succesfully." },
                    data: { $ref: "#/components/schemas/Blog" },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing blog id or update fields",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/blog/delete-blog": {
      post: {
        tags: ["Blogs"],
        summary: "Delete a blog",
        description: "Admin-only endpoint to delete a blog post by id.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BlogIdRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Blog deletion result",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean", example: true },
                    message: { type: "string", example: "Blog deleted succesfully." },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/blog/like-blog": {
      post: {
        tags: ["Blogs"],
        summary: "Like a blog",
        description: "Authenticated users can like a blog. Duplicate likes are ignored.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BlogIdRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Blog liked successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    likes: { type: "integer", example: 3 },
                    blog: { $ref: "#/components/schemas/Blog" },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing blog id",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Blog id is required" },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: {
            description: "Blog not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Blog not found" },
                  },
                },
              },
            },
          },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
    "/blog/comment-blog": {
      post: {
        tags: ["Blogs"],
        summary: "Add a comment to a blog",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CommentBlogRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Comment added successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Comment added" },
                    blog: { $ref: "#/components/schemas/Blog" },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing blog id or comment text",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Blog id and text are required",
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: {
            description: "Blog not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Blog not found" },
                  },
                },
              },
            },
          },
          500: { $ref: "#/components/responses/ServerError" },
        },
      },
    },
  },
};

const swaggerUiOptions = {
  explorer: true,
  customSiteTitle: "Blog App API Docs",
};

module.exports = {
  swaggerDocument,
  swaggerUi,
  swaggerUiOptions,
};
