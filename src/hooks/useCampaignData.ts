import { useEffect, useState } from 'react';
import { getAvailability, getCampaign } from '../lib/api';
import { campaignStore } from '../lib/campaignStore';
import type { AvailabilitySnapshot, Campaign } from '../types';

const CAMPAIGN_SLUG = 'prova-premiada-demo';

export function useCampaignData() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getCampaign(CAMPAIGN_SLUG)
      .then((c) => {
        if (!active) return;
        setCampaign(c);
        return getAvailability(c.id);
      })
      .then((a) => {
        if (!active || !a) return;
        setAvailability(a);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Mantém a página pública em sincronia com edições feitas no PackLP Admin
  // (mesma aba ou entre abas), sem depender apenas do fetch inicial.
  useEffect(() => {
    return campaignStore.subscribe(() => {
      const { campaign: c, availability: a } = campaignStore.getState();
      setCampaign((prev) => (prev ? { ...c, slug: prev.slug } : c));
      setAvailability(a);
    });
  }, []);

  return { campaign, availability, loading };
}
