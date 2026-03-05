import { X } from 'lucide-react';

interface ChangelogModalProps {
  onClose: () => void;
  changelog: string;
}

export function ChangelogModal({ onClose, changelog }: ChangelogModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Changelog</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="changelog-content">
            {changelog.split('\n').map((line, index) => {
              if (line.startsWith('## ')) {
                return <h3 key={index} className="changelog-version">{line.replace('## ', '')}</h3>;
              } else if (line.startsWith('### ')) {
                return <h4 key={index} className="changelog-section">{line.replace('### ', '')}</h4>;
              } else if (line.startsWith('- ')) {
                return (
                  <li key={index} className="changelog-item">
                    {line.replace('- ', '')}
                  </li>
                );
              } else if (line.startsWith('#### ')) {
                return <h5 key={index} className="changelog-subsection">{line.replace('#### ', '')}</h5>;
              } else if (line.trim()) {
                return <p key={index} className="changelog-text">{line}</p>;
              }
              return <br key={index} />;
            })}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
