
import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { X, RefreshCw, Settings } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface BaseNodeProps {
  id: string;
  data: {
    label: string;
    type: string;
    inputType?: string;
    outputFields?: {
      name: string;
      type: string;
      description: string;
    }[];
  };
  selected?: boolean;
}

export function BaseNode({ id, data, selected }: BaseNodeProps) {
  const [showOutputs, setShowOutputs] = useState(false);

  const getIconForType = () => {
    switch (data.type) {
      case 'input':
        return (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const togglePanel = () => {
    setShowOutputs(!showOutputs);
  };

  return (
    <div className="relative">
      <div className="border border-blue-300 rounded-lg w-80 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-blue-50 p-3 flex justify-between items-center">
          <div className="flex items-center">
            {getIconForType()}
            <span className="text-blue-700 font-medium">{data.label}</span>
          </div>
          <div className="flex items-center">
            <button 
              className="text-blue-600 hover:text-blue-800 mr-2"
              onClick={togglePanel}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Description */}
        <div className="p-3 bg-blue-50 border-b border-blue-100 text-sm text-gray-600">
          Pass data of different types into your workflow
        </div>
        
        {/* Input Name - Editable */}
        <div className="bg-blue-100 p-3 text-center text-sm text-blue-700">
          <input 
            type="text"
            defaultValue={id}
            className="bg-transparent border-none text-center w-full focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
          />
        </div>
        
        {/* Node Configuration */}
        <div className="p-3">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <Label className="text-gray-700 font-medium">Type</Label>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md">Dropdown</span>
            </div>
            <div className="relative">
              <Select value={data.inputType} onValueChange={(value) => console.log(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="files">Files</SelectItem>
                  <SelectItem value="list-files">Lists of Files</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="knowledgebase">Knowledgebase</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Handle 
          type="source" 
          position={Position.Right} 
          className={"!absolute !right-0 !top-1/2 !translate-y-1/2 !w-4 !h-4 !rounded-full !bg-blue-500 !border-2 !border-white"}
        />
      </div>
      
      {/* Side Panel */}
      {showOutputs && (
        <div className="absolute top-0 left-full ml-4 border border-blue-300 rounded-lg w-80 bg-white shadow-sm overflow-hidden">
          <div className="bg-blue-50 p-3 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-blue-700 font-medium">Outputs</span>
            </div>
            <button className="text-gray-500 hover:text-gray-700" onClick={togglePanel}>
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-3 bg-blue-50 border-b border-blue-100 text-sm text-gray-600">
            Type "{{" in downstream nodes to leverage output fields.
          </div>
          
          <div className="p-3 max-h-64 overflow-y-auto">
            <div className="mb-2 text-gray-700 font-medium">Output Fields</div>
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
              <div className="text-sm">
                <div className="text-blue-600">text</div>
                <div className="text-gray-500 text-xs">The inputted text</div>
              </div>
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded">Text</span>
            </div>
            
            <div className="mt-4 mb-2">
              <div className="flex items-center text-blue-600">
                <span className="mr-1">•</span>
                <span className="font-medium">Advanced Outputs</span>
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
              <div className="text-sm">
                <div className="text-blue-600">complete</div>
              </div>
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">Path</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
