import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useBitcoinWallet() {
  const [walletId, setWalletId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    setLoading(true);
    console.log('🔍 Fetching active BTC wallet...');
    
    const { data, error } = await supabase
      .from('btc_wallets')
      .select('id, name, is_active, is_primary')
      .eq('is_active', true)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('❌ Wallet fetch error:', error);
      toast({
        title: "Wallet Configuration Error",
        description: "Unable to load Bitcoin wallet. Please contact support.",
        variant: "destructive",
      });
      setWalletId(undefined);
      setLoading(false);
      return;
    }
    
    if (data) {
      console.log(`✅ Bitcoin wallet loaded: ${data.name} (ID: ${data.id})`);
      setWalletId(data.id);
    } else {
      console.warn('⚠️ No active Bitcoin wallet configured');
      setWalletId(undefined);
    }
    
    setLoading(false);
  };

  const verifyWallet = async (): Promise<boolean> => {
    if (!walletId) return false;
    
    const { data, error } = await supabase
      .from('btc_wallets')
      .select('id')
      .eq('id', walletId)
      .eq('is_active', true)
      .maybeSingle();
    
    if (!data || error) {
      toast({
        title: "Wallet Unavailable",
        description: "Selected wallet is no longer available. Refreshing...",
        variant: "destructive",
      });
      await fetchWallet();
      return false;
    }
    
    return true;
  };

  return { 
    walletId, 
    loading, 
    refreshWallet: fetchWallet,
    verifyWallet 
  };
}
