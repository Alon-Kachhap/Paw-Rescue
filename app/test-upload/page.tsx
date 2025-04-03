"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TestUploadPage() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState<string | null>(null);
  const [animalId, setAnimalId] = useState<string>("test-animal-id");
  const [orgId, setOrgId] = useState<string>("test-org-id");

  const handleUploadComplete = (url: string, key: string) => {
    setUploadedImageUrl(url);
    setFileKey(key);
    console.log("Uploaded file:", { url, key });
  };

  const handleRemove = () => {
    setUploadedImageUrl(null);
    setFileKey(null);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">R2 File Upload Test</h1>

      <Tabs defaultValue="simple">
        <TabsList className="mb-4">
          <TabsTrigger value="simple">Simple Upload</TabsTrigger>
          <TabsTrigger value="animal">Animal Upload</TabsTrigger>
          <TabsTrigger value="organization">Organization Upload</TabsTrigger>
          <TabsTrigger value="multiple">Multiple Files</TabsTrigger>
        </TabsList>

        <TabsContent value="simple">
          <Card>
            <CardHeader>
              <CardTitle>Simple File Upload</CardTitle>
              <CardDescription>
                Upload a file to Cloudflare R2
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUpload
                onUploadComplete={handleUploadComplete}
                folder="test"
                buttonText="Upload an image"
                value={uploadedImageUrl || undefined}
                fileKey={fileKey || undefined}
                onRemove={handleRemove}
              />

              {uploadedImageUrl && (
                <div className="border p-4 rounded-md bg-muted/50">
                  <h3 className="font-medium mb-2">Upload Details:</h3>
                  <p className="text-sm mb-1">
                    <span className="font-semibold">URL:</span>{" "}
                    <a
                      href={uploadedImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline break-all"
                    >
                      {uploadedImageUrl}
                    </a>
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-semibold">File Key:</span>{" "}
                    <span className="break-all">{fileKey}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="animal">
          <Card>
            <CardHeader>
              <CardTitle>Animal Media Upload</CardTitle>
              <CardDescription>
                Upload a file associated with an animal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="animalId">Animal ID</Label>
                  <Input 
                    id="animalId" 
                    value={animalId} 
                    onChange={(e) => setAnimalId(e.target.value)} 
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setAnimalId("test-animal-id")}
                  >
                    Reset
                  </Button>
                </div>
              </div>

              <FileUpload
                onUploadComplete={handleUploadComplete}
                folder="animals"
                buttonText="Upload animal image"
                value={uploadedImageUrl || undefined}
                fileKey={fileKey || undefined}
                onRemove={handleRemove}
                entityId={{ animalId }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization Media Upload</CardTitle>
              <CardDescription>
                Upload a file associated with an organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="orgId">Organization ID</Label>
                  <Input 
                    id="orgId" 
                    value={orgId} 
                    onChange={(e) => setOrgId(e.target.value)} 
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setOrgId("test-org-id")}
                  >
                    Reset
                  </Button>
                </div>
              </div>

              <FileUpload
                onUploadComplete={handleUploadComplete}
                folder="organizations"
                buttonText="Upload organization image"
                value={uploadedImageUrl || undefined}
                fileKey={fileKey || undefined}
                onRemove={handleRemove}
                entityId={{ organizationId: orgId }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multiple">
          <Card>
            <CardHeader>
              <CardTitle>Multiple File Upload</CardTitle>
              <CardDescription>
                Upload multiple files to different folders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Document</h3>
                  <FileUpload
                    onUploadComplete={(url, key) => console.log("Document:", url, key)}
                    folder="documents"
                    accept=".pdf,.doc,.docx"
                    buttonText="Upload document"
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Image</h3>
                  <FileUpload
                    onUploadComplete={(url, key) => console.log("Image:", url, key)}
                    folder="images"
                    accept="image/*"
                    buttonText="Upload image"
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Video</h3>
                  <FileUpload
                    onUploadComplete={(url, key) => console.log("Video:", url, key)}
                    folder="videos"
                    accept="video/*"
                    buttonText="Upload video"
                    maxSizeMB={50}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 