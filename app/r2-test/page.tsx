"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function R2TestPage() {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runR2Test = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/upload/test", {
        method: "GET",
      });
      
      const data = await response.json();
      setTestResult(data);
      
      if (!response.ok) {
        setError(data.message || "Failed to test R2 connectivity");
      }
    } catch (err) {
      setError("An error occurred while testing R2 connectivity");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Format JSON for readability
  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  useEffect(() => {
    // Automatically run the test when the page loads
    runR2Test();
  }, []);

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>R2 Connectivity Test</span>
            {loading && <Loader2 className="h-5 w-5 animate-spin inline-block" />}
            {testResult && testResult.success && <CheckCircle className="h-5 w-5 text-green-500" />}
            {testResult && !testResult.success && <XCircle className="h-5 w-5 text-red-500" />}
          </CardTitle>
          <CardDescription>
            Test the connection to Cloudflare R2 for file uploads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runR2Test} 
            disabled={loading}
            className="mb-4"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Test R2 Connection"
            )}
          </Button>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-md text-red-700 dark:text-red-400">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {testResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Status:</span>
                {testResult.success ? (
                  <span className="text-green-600 dark:text-green-400">Success</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">Failed</span>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Test Results</h3>
                <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-auto text-sm max-h-96">
                  {formatJson(testResult)}
                </pre>
              </div>

              {testResult.urlGeneration && testResult.urlGeneration.success && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Generated URLs</h3>
                  <div className="space-y-1">
                    <p><strong>Upload URL:</strong> <span className="text-xs break-all">{testResult.urlGeneration.uploadUrl}</span></p>
                    <p><strong>File Key:</strong> <span className="text-xs break-all">{testResult.urlGeneration.fileKey}</span></p>
                    <p><strong>Public URL:</strong> <span className="text-xs break-all">{testResult.urlGeneration.publicUrl}</span></p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 