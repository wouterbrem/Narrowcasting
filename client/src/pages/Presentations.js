import React from 'react';
import { Presentation as PresentationIcon } from 'lucide-react';

function Presentations({ presentations, slides, devices }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Presentations</h1>
        <p className="page-description">
          Create and manage presentations from your slides
        </p>
      </div>

      <div className="empty-state card">
        <div className="empty-state-icon">
          <PresentationIcon size={48} />
        </div>
        <h4 className="empty-state-title">Presentation Management (Coming Soon)</h4>
        <p className="empty-state-description">
          Currently {presentations.length} presentations. Use the API to create presentations for now.
        </p>
        <pre style={{ textAlign: 'left', fontSize: '12px', padding: '20px', background: 'var(--color-background)', borderRadius: '8px', overflow: 'auto', maxWidth: '600px', margin: '20px auto' }}>
{`# Create a presentation:
curl -X POST http://localhost:3001/api/presentations \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Reception Display",
    "slides": [
      {"slideId": "SLIDE_ID_HERE", "duration": 30}
    ],
    "branding": {
      "enabled": true,
      "text": "Company Name"
    }
  }'`}
        </pre>
      </div>
    </div>
  );
}

export default Presentations;
