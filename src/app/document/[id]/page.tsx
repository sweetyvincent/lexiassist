import { DocumentView } from '@/components/legal/document-view';

export function generateStaticParams() {
  return [{ id: 'demo' }];
}

export default function DocumentPage({ params }: { params: { id: string } }) {
  return <DocumentView docId={params.id} />;
}
