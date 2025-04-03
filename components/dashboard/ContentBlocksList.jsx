import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function ContentBlocksList({ contentBlocks, organizationId }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    content: "",
  });
  
  const contentTypeOptions = [
    { value: "banner", label: "Banner" },
    { value: "cta", label: "Call to Action" },
    { value: "gallery", label: "Gallery" },
    { value: "text", label: "Text Content" },
  ];
  
  const resetForm = () => {
    setFormData({
      type: "",
      content: "",
    });
    setEditingBlock(null);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        organizationId,
      };
      
      const url = editingBlock
        ? `/api/content-blocks/${editingBlock.id}`
        : "/api/content-blocks";
      
      const method = editingBlock ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        resetForm();
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to save content block:", error);
    }
  };
  
  const handleEdit = (block) => {
    setEditingBlock(block);
    setFormData({
      type: block.type,
      content: block.content,
    });
    setOpen(true);
  };
  
  const handleDelete = async (blockId) => {
    if (!confirm("Are you sure you want to delete this content block?")) return;
    
    try {
      const response = await fetch(`/api/content-blocks/${blockId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete content block:", error);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Website Content Blocks</CardTitle>
        <Dialog open={open} onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>Add Content Block</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBlock ? "Edit Content Block" : "Add New Content Block"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Content Type</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <Textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={8}
                  required
                  placeholder="Enter your content here. For banner and gallery, use comma-separated image URLs. For text and CTA, enter formatted content."
                />
              </div>
              <div className="flex space-x-2 justify-end">
                <Button variant="outline" type="button" onClick={() => {
                  resetForm();
                  setOpen(false);
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBlock ? "Update" : "Add"} Content Block
                </Button>
              </div>
            </form>
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {contentBlocks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No content blocks added yet. Add your first content block!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentBlocks.map((block) => (
                <TableRow key={block.id}>
                  <TableCell className="font-medium capitalize">
                    {block.type}
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {block.content.substring(0, 100)}
                    {block.content.length > 100 ? "..." : ""}
                  </TableCell>
                  <TableCell>
                    {new Date(block.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(block)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(block.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
        