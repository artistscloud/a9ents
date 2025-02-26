
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function SiteNotification() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotification = async () => {
      const { data, error } = await supabase
        .from('site_notifications')
        .select('message')
        .eq('active', true)
        .single();

      if (!error && data) {
        setMessage(data.message);
      }
    };

    fetchNotification();

    // Subscribe to changes
    const channel = supabase
      .channel('site_notifications')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'site_notifications' 
        }, 
        () => {
          fetchNotification();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (!message) return null;

  return (
    <div className="bg-muted/50 border-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-3 text-center text-sm">
          {message}
        </div>
      </div>
    </div>
  );
}
