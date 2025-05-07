import Layout from '@/components/Layout';
import TruckParametersForm from '@/components/TruckParametersForm';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function TruckParameters() {
  return (
    <Layout
      title="Parametri Camion"
    >
      <TruckParametersForm />
    </Layout>
  );
}
