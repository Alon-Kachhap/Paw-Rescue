import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const ApiRefresh = ({ 
  onClick, 
  isLoading = false,
  label = "Refresh Data"
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      {label}
    </Button>
  );
};

export default ApiRefresh; 