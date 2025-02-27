
import { Node } from '@xyflow/react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NodeData, DataType } from '../types/nodes';

interface NodeConfigPanelProps {
  selectedNode: Node | null;
  updateNodeData: (nodeId: string, newData: Partial<NodeData>) => void;
}

export function NodeConfigPanel({ selectedNode, updateNodeData }: NodeConfigPanelProps) {
  if (!selectedNode) return null;

  const nodeData = selectedNode.data as NodeData;

  const renderNodeConfig = () => {
    switch (selectedNode.type) {
      case 'input': {
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Input Type</Label>
              <Select 
                value={nodeData.inputType} 
                onValueChange={(value: keyof DataType) => 
                  updateNodeData(selectedNode.id, { 
                    inputType: value,
                    outputs: [{ name: 'value', type: value, description: `Input ${value}` }]
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select input type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Label</Label>
              <Input 
                value={nodeData.label} 
                onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })} 
                placeholder="Enter label"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={nodeData.description || ''} 
                onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })} 
                placeholder="Enter description"
              />
            </div>
          </div>
        );
      }
      default: {
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input 
                value={nodeData.label} 
                onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })} 
                placeholder="Enter label"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={nodeData.description || ''} 
                onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })} 
                placeholder="Enter description"
              />
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="w-80 border-l p-4 bg-background">
      <h3 className="text-lg font-semibold mb-4">
        {nodeData.label || selectedNode.type} Configuration
      </h3>
      {renderNodeConfig()}
    </div>
  );
}
