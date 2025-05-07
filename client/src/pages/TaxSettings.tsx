import Layout from '@/components/Layout';
import TaxSettingsForm from '@/components/TaxSettingsForm';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function TaxSettings() {
  return (
    <Layout
      title="Tasse e Regime Fiscale"
    >
      <TaxSettingsForm />
    </Layout>
  );
}
