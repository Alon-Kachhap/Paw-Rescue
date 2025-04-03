export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export function errorHandler(error: Error | ApiError) {
  console.error('Error occurred:', error);
  
  if (error instanceof ApiError) {
    return Response.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  
  return Response.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  );
} 