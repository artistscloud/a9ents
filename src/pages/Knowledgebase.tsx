
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KnowledgebaseList } from "@/components/knowledgebase/KnowledgebaseList";
import { FileUpload } from "@/components/knowledgebase/FileUpload";
import { WebsiteScraper } from "@/components/knowledgebase/WebsiteScraper";

const Knowledgebase = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();

  return (
    <div className="animate-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Knowledge Base</h1>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Knowledge
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add to Knowledge Base</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="upload" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload File</TabsTrigger>
                <TabsTrigger value="website">Scrape Website</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-4">
                <FileUpload onSuccess={() => setAddDialogOpen(false)} />
              </TabsContent>
              <TabsContent value="website" className="mt-4">
                <WebsiteScraper onSuccess={() => setAddDialogOpen(false)} />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      
      <KnowledgebaseList />
    </div>
  );
};

export default Knowledgebase;
