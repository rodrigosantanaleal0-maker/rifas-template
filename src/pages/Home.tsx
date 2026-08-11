import { useEffect, useState } from 'react';
import { PauseCircle, XCircle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { StickyCta } from '../components/layout/StickyCta';
import { Hero } from '../components/sections/Hero';
import { AvailabilityBar } from '../components/sections/AvailabilityBar';
import { Packages } from '../components/sections/Packages';
import { NumberSelector } from '../components/sections/NumberSelector';
import { HowItWorks } from '../components/sections/HowItWorks';
import { Testimonials } from '../components/sections/Testimonials';
import { InfluencerSection } from '../components/sections/InfluencerSection';
import { Winners } from '../components/sections/Winners';
import { Transparency } from '../components/sections/Transparency';
import { Faq } from '../components/sections/Faq';
import { FinalCta } from '../components/sections/FinalCta';
import { useCampaignData } from '../hooks/useCampaignData';

export function Home() {
  const { campaign, availability, loading } = useCampaignData();
  const [requestedQuantity, setRequestedQuantity] = useState<number | null>(null);

  // "Nome da campanha" (título interno) e os campos de SEO só existem para o
  // administrador editar — refletimos aqui no <title>/meta description, que é
  // o único lugar da página pública onde eles têm efeito visível hoje.
  useEffect(() => {
    if (!campaign) return;
    document.title = campaign.seoTitle?.trim() || campaign.title;
    if (campaign.seoDescription?.trim()) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', campaign.seoDescription);
    }
  }, [campaign]);

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      {campaign && campaign.status !== 'active' && (
        <div
          className={
            campaign.status === 'paused'
              ? 'flex items-center justify-center gap-2 bg-violet-500/15 px-4 py-3 text-center text-sm font-semibold text-violet-300'
              : 'flex items-center justify-center gap-2 bg-surface-2 px-4 py-3 text-center text-sm font-semibold text-ink-muted'
          }
          role="status"
        >
          {campaign.status === 'paused' ? <PauseCircle size={16} /> : <XCircle size={16} />}
          {campaign.status === 'paused' ? 'Campanha temporariamente pausada.' : 'Campanha encerrada.'}
        </div>
      )}
      <main>
        <Hero campaign={campaign} availability={availability} loading={loading} />
        <AvailabilityBar availability={availability} loading={loading} />
        <Packages onSelect={setRequestedQuantity} />
        <NumberSelector
          campaign={campaign}
          requestedQuantity={requestedQuantity}
          onConsumeRequest={() => setRequestedQuantity(null)}
        />
        <HowItWorks />
        <Testimonials />
        <InfluencerSection />
        <Winners />
        <Transparency />
        <Faq />
        <FinalCta campaign={campaign} />
      </main>
      <Footer />
      <StickyCta campaign={campaign} />
    </div>
  );
}
