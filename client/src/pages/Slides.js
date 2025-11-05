import React from 'react';
import { Layers } from 'lucide-react';

function Slides({ slides }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Slides</h1>
        <p className="page-description">
          Manage your content slides (Web, YouTube, Weather, RSS, Clock, Images, etc.)
        </p>
      </div>

      <div className="empty-state card">
        <div className="empty-state-icon">
          <Layers size={48} />
        </div>
        <h4 className="empty-state-title">Slides Management (Coming Soon)</h4>
        <p className="empty-state-description">
          Currently {slides.length} slides. Use the API to create slides for now.
        </p>
        <pre style={{ textAlign: 'left', fontSize: '12px', padding: '20px', background: 'var(--color-background)', borderRadius: '8px', overflow: 'auto', maxWidth: '600px', margin: '20px auto' }}>
{`# Create a clock slide:
curl -X POST http://localhost:3001/api/slides \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Office Clock",
    "type": "clock",
    "duration": 10,
    "config": {
      "format": "24h",
      "showDate": true
    }
  }'`}
        </pre>
      </div>
    </div>
  );
}

export default Slides;
