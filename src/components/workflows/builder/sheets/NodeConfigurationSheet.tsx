
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface NodeConfigurationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  node: {
    id: string;
    type: string;
    data: {
      label: string;
      type?: string;
      configuration?: Record<string, any>;
    };
  };
  onUpdate: (nodeId: string, updates: any) => void;
}

export function NodeConfigurationSheet({ isOpen, onClose, node, onUpdate }: NodeConfigurationSheetProps) {
  const [label, setLabel] = useState(node.data.label);
  const [config, setConfig] = useState(node.data.configuration || {});

  const handleSave = () => {
    onUpdate(node.id, {
      data: {
        ...node.data,
        label,
        configuration: config,
      },
    });
    onClose();
  };

  const renderTriggerConfig = () => {
    switch (node.data.type) {
      case 'webhook':
        return (
          <div className="space-y-4">
            <div>
              <Label>Webhook URL</Label>
              <Input 
                value={config.url || ''} 
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                placeholder="https://api.example.com/webhook"
              />
            </div>
            <div>
              <Label>Method</Label>
              <Select 
                value={config.method || 'POST'} 
                onValueChange={(value) => setConfig({ ...config, method: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="space-y-4">
            <div>
              <Label>Cron Expression</Label>
              <Input 
                value={config.cron || ''} 
                onChange={(e) => setConfig({ ...config, cron: e.target.value })}
                placeholder="0 0 * * *"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderActionConfig = () => {
    switch (node.data.type) {
      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <Label>To</Label>
              <Input 
                value={config.to || ''} 
                onChange={(e) => setConfig({ ...config, to: e.target.value })}
                placeholder="recipient@example.com"
              />
            </div>
            <div>
              <Label>Subject</Label>
              <Input 
                value={config.subject || ''} 
                onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label>Body</Label>
              <Textarea 
                value={config.body || ''} 
                onChange={(e) => setConfig({ ...config, body: e.target.value })}
                placeholder="Email body"
              />
            </div>
          </div>
        );
      case 'api':
        return (
          <div className="space-y-4">
            <div>
              <Label>URL</Label>
              <Input 
                value={config.url || ''} 
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <div>
              <Label>Method</Label>
              <Select 
                value={config.method || 'GET'} 
                onValueChange={(value) => setConfig({ ...config, method: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Headers (JSON)</Label>
              <Textarea 
                value={config.headers || ''} 
                onChange={(e) => setConfig({ ...config, headers: e.target.value })}
                placeholder='{"Content-Type": "application/json"}'
              />
            </div>
            <div>
              <Label>Body (JSON)</Label>
              <Textarea 
                value={config.body || ''} 
                onChange={(e) => setConfig({ ...config, body: e.target.value })}
                placeholder='{"key": "value"}'
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[400px]">
        <SheetHeader>
          <SheetTitle>Configure {node.data.label}</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label>Label</Label>
            <Input 
              value={label} 
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Node label"
            />
          </div>
          {node.type === 'trigger' && renderTriggerConfig()}
          {node.type === 'action' && renderActionConfig()}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
